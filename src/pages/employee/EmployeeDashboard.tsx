import { useEffect, useState } from 'react';
import './EmployeeDashboard.css';
import { endpoints } from '../../api/apiEndpoints';
import RequestsTable from '../../components/requests/RequestsTable';
import EmployeeRequestDetail from '../../components/requests/EmployeeRequestDetail';

interface DashboardSummary {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

interface RecentRequestItem {
  id: string;
  workflowId: string;
  workflowName: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  currentStep: number;
}

export default function EmployeeDashboard() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [recentRequests, setRecentRequests] = useState<RecentRequestItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
        // Fetch employee dashboard stats
        const dashRes = await fetch(endpoints.dashboard, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
        });
        if (!dashRes.ok) throw new Error('Failed to fetch dashboard');
        const dashJson = await dashRes.json();
        const s = dashJson?.summary ?? { total: 0, pending: 0, approved: 0, rejected: 0 };
        setSummary(s);
        const recent = Array.isArray(dashJson?.recentRequests) ? dashJson.recentRequests.map((r: any) => ({
          id: r.id ?? r._id ?? '',
          workflowId: r.workflowId ?? r.workflow?.id ?? r.data?.workflow?.id ?? '',
          workflowName: r.workflowName ?? r.workflow?.name ?? r.data?.workflow?.name ?? '',
          title: r.title ?? r.data?.title ?? '',
          description: r.description ?? r.data?.description ?? '',
          status: r.status ?? r.data?.status ?? '',
          createdAt: r.createdAt ?? r.data?.createdAt ?? '',
          currentStep: r.currentStep ?? r.data?.currentStep ?? 0
        })) : [];
        setRecentRequests(recent.slice(0, 5));

        // Available workflows moved to /employee/workflows page
      } catch (err) {
        console.error(err);
        setError((err as Error).message || 'Failed to load dashboard');
        setSummary({ total: 0, pending: 0, approved: 0, rejected: 0 });
        setRecentRequests([]);
      } finally {
        setLoading(false);
      }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  return (
    <div className="employee-page">
      <main className="employee-main">

        <div className="employee-container">
          {/* Stats Cards */}
          <section className="stats-row">
            <div className="stat-card">
              <div className="stat-card-title" style={{ color: '#1976D2' }}>Total Requests</div>
              <div className="stat-card-value">{loading ? '...' : summary?.total ?? 0}</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-title" style={{ color: '#FFC107' }}>Pending</div>
              <div className="stat-card-value">{loading ? '...' : summary?.pending ?? 0}</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-title" style={{ color: '#4CAF50' }}>Approved</div>
              <div className="stat-card-value">{loading ? '...' : summary?.approved ?? 0}</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-title" style={{ color: '#DC3545' }}>Rejected</div>
              <div className="stat-card-value">{loading ? '...' : summary?.rejected ?? 0}</div>
            </div>
          </section>

          {/* Create Request Button removed from dashboard (use sidebar) */}

          {/* Available Workflows moved to sidebar -> /employee/workflows */}

          {/* Recent Requests Table */}
          <section className="recent-requests-card">
            <h3>Recent Requests</h3>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <RequestsTable 
              requests={recentRequests} 
              loading={loading} 
              onViewRequest={(requestId) => {
                setSelectedRequestId(requestId);
                setIsModalVisible(true);
              }}
            />
          </section>
        </div>
      </main>

      {selectedRequestId && (
        <EmployeeRequestDetail 
          requestId={selectedRequestId}
          visible={isModalVisible}
          onClose={() => {
            setIsModalVisible(false);
            setSelectedRequestId(null);
            // Refresh data when modal is closed
            loadDashboardData();
          }}
        />
      )}
    </div>
  );
}
