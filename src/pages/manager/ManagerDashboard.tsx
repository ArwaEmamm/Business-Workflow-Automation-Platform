import { useEffect, useState } from 'react';
import { endpoints } from '../../api/apiEndpoints';
import { BarChart3, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import '../admin/AdminDashboard.css';

interface ManagerDashboardData {
  summary?: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
}

export default function ManagerDashboard() {
  const [data, setData] = useState<ManagerDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch(endpoints.dashboard, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }

        const json = await response.json();
        setData(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <div style={{ padding: '24px', textAlign: 'center', color: '#059669' }}>Loading dashboard...</div>;
  if (error) return <div style={{ padding: '24px', color: 'red' }}>Error: {error}</div>;

  const summary = data?.summary ?? { total: 0, pending: 0, approved: 0, rejected: 0 };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fbff', padding: '20px' }}>
      <div className="page-header">
        <div className="page-title-section">
          <BarChart3 size={32} color="#059669" className="page-title-icon" style={{ color: '#059669' }} />
          <div>
            <h1 className="page-title">Dashboard</h1>
            <p className="page-subtitle">Overview of all workflow requests under your supervision</p>
          </div>
        </div>
      </div>

      <section className="stats-row">
        <div className="stat-card total">
          <div className="stat-card-header">
            <BarChart3 size={24} className="stat-icon" style={{ color: '#059669' }} />
            <div className="stat-card-title">Total Requests</div>
          </div>
          <div className="stat-card-value">{loading ? '...' : summary?.total ?? 0}</div>
        </div>
        <div className="stat-card pending">
          <div className="stat-card-header">
            <AlertCircle size={24} className="stat-icon" style={{ color: '#f59e0b' }} />
            <div className="stat-card-title">Pending</div>
          </div>
          <div className="stat-card-value">{loading ? '...' : summary?.pending ?? 0}</div>
        </div>
        <div className="stat-card approved">
          <div className="stat-card-header">
            <CheckCircle2 size={24} className="stat-icon" style={{ color: '#10b981' }} />
            <div className="stat-card-title">Approved</div>
          </div>
          <div className="stat-card-value">{loading ? '...' : summary?.approved ?? 0}</div>
        </div>
        <div className="stat-card rejected">
          <div className="stat-card-header">
            <XCircle size={24} className="stat-icon" style={{ color: '#dc2626' }} />
            <div className="stat-card-title">Rejected</div>
          </div>
          <div className="stat-card-value">{loading ? '...' : summary?.rejected ?? 0}</div>
        </div>
      </section>
    </div>
  );
}