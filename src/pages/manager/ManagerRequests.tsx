import { useEffect, useState } from 'react';
import { endpoints } from '../../api/apiEndpoints';
import RequestsTable from '../../components/requests/RequestsTable';
import EmployeeRequestDetail from '../../components/requests/EmployeeRequestDetail';
import { FileTextOutlined } from '@ant-design/icons';
import '../admin/RequestsList.css';

interface RequestItem {
  id: string;
  title: string;
  description?: string;
  status: string;
  currentStep?: number;
  workflowName?: string;
  createdBy?: { name?: string; email?: string };
  createdAt?: string;
  attachments?: any[];
  workflow?: any;
  approvals?: any[];
}

export default function ManagerRequests() {
  const [pending, setPending] = useState<RequestItem[]>([]);
  const [allRequests, setAllRequests] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedRequest, setSelectedRequest] = useState<RequestItem | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const fetchPending = async () => {
    try {
      const res = await fetch(endpoints.requests.pending, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
      });
      if (!res.ok) throw new Error('Failed to fetch pending requests');
      const body = await res.json();
      // backend returns { success, count, data: [...] }
      const list = Array.isArray(body.data) ? body.data : [];
      setPending(list);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  const fetchAll = async () => {
    try {
      const res = await fetch(endpoints.requests.getAll, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
      });
      if (!res.ok) throw new Error('Failed to fetch requests');
      const body = await res.json();
      const list = Array.isArray(body.data) ? body.data : (Array.isArray(body) ? body : []);
      setAllRequests(list);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await Promise.all([fetchPending(), fetchAll()]);
      setLoading(false);
    };
    load();
  }, []);

  const openDetails = (requestId: string) => {
    setSelectedRequest({ id: requestId } as RequestItem);
    setDetailsOpen(true);
  };

  const closeDetails = () => {
    setSelectedRequest(null);
    setDetailsOpen(false);
    // refresh lists when closing details to reflect any changes
    fetchPending().catch(() => {});
    fetchAll().catch(() => {});
  };

  const performAction = async (requestId: string, decision: 'approved' | 'rejected') => {
    try {
      // backend expects POST /requests/:id/approve with decision in body
      const token = localStorage.getItem('auth_token');
      if (!token) throw new Error('Not authenticated');

      const res = await fetch(endpoints.requests.approve(requestId), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ decision, comment: '' })
      });

      if (res.status === 403) {
        const txt = await res.text().catch(() => 'Forbidden');
        throw new Error(`Forbidden: ${txt}`);
      }

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || `Action failed (status ${res.status})`);
      }
      // refresh lists
      await Promise.all([fetchPending(), fetchAll()]);
      closeDetails();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  if (loading) return <div style={{ padding: 24 }}>Loading...</div>;
  if (error) return <div style={{ padding: 24 }}><strong style={{ color: 'red' }}>{error}</strong></div>;

  return (
    <>
      <div className="page-header">
        <div className="page-title-section">
          <FileTextOutlined className="page-title-icon" />
          <div>
            <h1 className="page-title">Requests</h1>
            <p className="page-subtitle">Track and manage all workflow requests</p>
          </div>
        </div>
      </div>

      <section className="stats-row">
        <div className="stat-card">
          <div className="stat-card-title" style={{ color: '#059669' }}>Pending</div>
          <div className="stat-card-value">{pending.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-title" style={{ color: '#10b981' }}>Approved</div>
          <div className="stat-card-value">{allRequests.filter(r => r.status === 'approved').length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-title" style={{ color: '#dc2626' }}>Rejected</div>
          <div className="stat-card-value">{allRequests.filter(r => r.status === 'rejected').length}</div>
        </div>
      </section>

      <section className="requests-table-section">
        <RequestsTable
          requests={pending.map(r => ({
            id: r.id,
            title: r.title ?? '',
            description: r.description ?? '',
            status: r.status ?? '',
            currentStep: r.currentStep ?? 0,
            createdAt: r.createdAt || '',
            workflowId: (r.workflow && (r.workflow.id || r.workflow._id)) || r.workflow?.id || '',
            workflowName: r.workflow?.name || r.workflowName || '',
            attachments: r.attachments || [],
            workflow: r.workflow
          }))}
          loading={loading}
          onViewRequest={(id) => openDetails(id)}
          onApprove={(id) => performAction(id, 'approved')}
          onReject={(id) => performAction(id, 'rejected')}
        />
      </section>

      <EmployeeRequestDetail
        requestId={selectedRequest?.id || ''}
        visible={detailsOpen}
        onClose={closeDetails}
      />
    </>
  );
}
