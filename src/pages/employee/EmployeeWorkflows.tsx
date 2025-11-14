import React, { useEffect, useState } from 'react';
import { endpoints } from '../../api/apiEndpoints';
import { Link } from 'react-router-dom';

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
      <h2>Available Workflows</h2>
      {loading && <div>Loading...</div>}
      {!loading && workflows.length === 0 && <div>No workflows available</div>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 12 }}>
        {workflows.map(wf => (
          <div key={wf.id} style={{ background: '#fff', padding: 12, borderRadius: 6 }}>
            <h4 style={{ marginTop: 0 }}>{wf.name}</h4>
            <p style={{ minHeight: 48 }}>{wf.description}</p>
            <Link to={`/employee/create-request?workflow=${wf.id}`}>Create Request</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeeWorkflows;
