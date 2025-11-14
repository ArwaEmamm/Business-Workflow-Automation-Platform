import React, { useEffect, useState } from 'react';
import { endpoints } from '../../api/apiEndpoints';
import RequestsTable from '../../components/requests/RequestsTable';
import EmployeeRequestDetail from '../../components/requests/EmployeeRequestDetail';
import '../../pages/employee/EmployeeDashboard.css';

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
  const [actionComment, setActionComment] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

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
    setActionComment('');
    setDetailsOpen(false);
    // refresh lists when closing details to reflect any changes
    fetchPending().catch(() => {});
    fetchAll().catch(() => {});
  };

  const performAction = async (requestId: string, decision: 'approved' | 'rejected') => {
    try {
      setActionLoading(true);
      // backend expects POST /requests/:id/approve with decision in body
      const token = localStorage.getItem('auth_token');
      if (!token) throw new Error('Not authenticated');

      const res = await fetch(endpoints.requests.approve(requestId), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ decision, comment: actionComment })
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
    } finally {
      setActionLoading(false);
    }
  };

  // compute stats from lists
  const pendingCount = pending.length;
  const approvedCount = allRequests.filter(r => r.status === 'approved').length;
  const rejectedCount = allRequests.filter(r => r.status === 'rejected').length;

  const avgResponseTime = (() => {
    try {
      const approved = allRequests.filter(r => r.status === 'approved' && Array.isArray(r.approvals) && r.approvals.length);
      if (!approved.length) return null;
      const diffs = approved.map(r => {
        const approvedEntry = (r.approvals && r.approvals[r.approvals.length - 1]) || null;
        if (!approvedEntry || !approvedEntry.date || !r.createdAt) return null;
        return new Date(approvedEntry.date).getTime() - new Date(r.createdAt).getTime();
      }).filter(Boolean) as number[];
      if (!diffs.length) return null;
      const avgMs = diffs.reduce((a,b) => a+b, 0) / diffs.length;
      return Math.round(avgMs / (1000*60)); // minutes
    } catch { return null; }
  })();

  if (loading) return <div style={{ padding: 24 }}>Loading...</div>;
  if (error) return <div style={{ padding: 24 }}><strong style={{ color: 'red' }}>{error}</strong></div>;

  return (
    <>
      <div className="employee-title">Manager Dashboard</div>

      <section className="stats-row">
        <div className="stat-card">
          <div className="stat-card-title" style={{ color: '#1976D2' }}>Pending</div>
          <div className="stat-card-value">{pendingCount}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-title" style={{ color: '#4CAF50' }}>Approved</div>
          <div className="stat-card-value">{approvedCount}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-title" style={{ color: '#DC2626' }}>Rejected</div>
          <div className="stat-card-value">{rejectedCount}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-title" style={{ color: '#666666' }}>Avg response (min)</div>
          <div className="stat-card-value">{avgResponseTime ?? '-'}</div>
        </div>
      </section>

      <section className="recent-requests-card">
        <h3 className="recent-requests-title">Pending Requests</h3>
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
