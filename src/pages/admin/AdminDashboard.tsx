import { useEffect, useState } from 'react';
import './AdminDashboard.css';
import { endpoints } from '../../api/apiEndpoints';

interface DashboardSummary {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

interface RecentRequestItem {
  id: string;
  workflowName: string;
  status: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [recentRequests, setRecentRequests] = useState<RecentRequestItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const res = await fetch(endpoints.dashboard, { headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` } });
        if (!res.ok) throw new Error('Failed to fetch dashboard');
        const json = await res.json();
        // expected shape: { success, message, summary: {...}, recentRequests: [...] }
        const s = json?.summary ?? { total: 0, pending: 0, approved: 0, rejected: 0 };
        const recent = Array.isArray(json?.recentRequests) ? json.recentRequests.map((r: any) => ({ id: r.id ?? r._id ?? '', workflowName: r.workflowName ?? r.workflow?.name ?? r.data?.workflow?.name ?? '', status: r.status ?? r.data?.status ?? '', createdAt: r.createdAt ?? r.data?.createdAt ?? '' })) : [];
        // sort by createdAt descending (newest first) then take 5
        recent.sort((a: any, b: any) => {
          const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return tb - ta;
        });
        setSummary(s);
        setRecentRequests(recent.slice(0, 5));
      } catch (err) {
        console.error(err);
        setError((err as Error).message || 'Failed to load dashboard');
        setSummary({ total: 0, pending: 0, approved: 0, rejected: 0 });
        setRecentRequests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <div className="admin-page">
      <main className="admin-main">
        <header className="admin-top">
          <div className="admin-top-inner">
            <h2>Admin Dashboard</h2>
          </div>
        </header>

        <div className="admin-container">
          <section className="stats-row">
            <div className="stat-card">
              <div className="stat-card-title" style={{ color: '#2563eb' }}>Total Requests</div>
              <div className="stat-card-value">{loading ? '...' : summary?.total ?? 0}</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-title" style={{ color: '#f59e0b' }}>Pending</div>
              <div className="stat-card-value">{loading ? '...' : summary?.pending ?? 0}</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-title" style={{ color: '#22c55e' }}>Approved</div>
              <div className="stat-card-value">{loading ? '...' : summary?.approved ?? 0}</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-title" style={{ color: '#ef4444' }}>Rejected</div>
              <div className="stat-card-value">{loading ? '...' : summary?.rejected ?? 0}</div>
            </div>
          </section>

          <section className="recent-requests-card">
            <h3>Recent Requests</h3>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <div className="recent-table-wrap">
              <table className="recent-table">
                <thead>
                  <tr>
                    <th>WORKFLOW</th>
                    <th>STATUS</th>
                    <th>DATE</th>
                  </tr>
                </thead>
                <tbody>
                  {recentRequests.map((r) => (
                    <tr key={r.id}>
                      <td>{r.workflowName || '-'}</td>
                      <td><span className={`status-pill ${r.status}`}>{r.status}</span></td>
                      <td>{r.createdAt ? new Date(r.createdAt).toLocaleString() : '-'}</td>
                    </tr>
                  ))}
                  {recentRequests.length === 0 && !loading && (
                    <tr>
                      <td colSpan={3} style={{ textAlign: 'center' }}>No recent requests</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
