import React, { useEffect, useState } from 'react';
import { endpoints } from '../../api/apiEndpoints';
import { Link } from 'react-router-dom';
import { FileTextOutlined } from '@ant-design/icons';
import '../admin/AdminDashboard.css';

interface WorkflowItem {
  id: string;
  name: string;
  description?: string;
}

const EmployeeWorkflows: React.FC = () => {
  const [workflows, setWorkflows] = useState<WorkflowItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(endpoints.workflows.getAll, { headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` } });
        if (!res.ok) throw new Error('Failed to fetch workflows');
        const json = await res.json();
        const list = Array.isArray(json) ? json : (json?.workflows ?? json?.data ?? []);
        setWorkflows(list.map((w: any) => ({ id: w.id ?? w._id, name: w.name, description: w.description })));
      } catch (err) {
        console.error(err);
        setWorkflows([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div>
      <div className="page-header">
        <div className="page-title-section">
          <FileTextOutlined className="page-title-icon" />
          <div>
            <h1 className="page-title">Available Workflows</h1>
            <p className="page-subtitle">Browse and start new workflow requests</p>
          </div>
        </div>
      </div>
      
      {loading && <div style={{ padding: '20px', textAlign: 'center', color: '#059669' }}>Loading workflows...</div>}
      {!loading && workflows.length === 0 && <div style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>No workflows available</div>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16 }}>
        {workflows.map(wf => (
          <div key={wf.id} style={{ 
            background: '#fff', 
            padding: 20, 
            borderRadius: 8,
            border: '2px solid #d1fae5',
            boxShadow: '0 4px 6px rgba(5,150,105,0.1)',
            transition: 'all 0.2s ease'
          }}>
            <h4 style={{ marginTop: 0, color: '#059669', fontWeight: 700 }}>{wf.name}</h4>
            <p style={{ minHeight: 48, color: '#6b7280', fontSize: '0.9rem' }}>{wf.description || 'No description'}</p>
            <Link to={`/employee/create-request?workflow=${wf.id}`} style={{
              display: 'inline-block',
              marginTop: '12px',
              padding: '8px 16px',
              background: 'linear-gradient(90deg, #059669 0%, #047857 100%)',
              color: 'white',
              borderRadius: '6px',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '0.9rem',
              transition: 'all 0.2s ease'
            }}>
              Create Request
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeeWorkflows;
