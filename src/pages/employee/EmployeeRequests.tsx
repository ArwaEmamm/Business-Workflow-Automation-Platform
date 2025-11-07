import { useEffect, useState } from 'react';
import { endpoints } from '../../api/apiEndpoints';

interface Request {
  id: string;
  title: string;
  status: string;
  createdAt: string;
  // Add more fields based on your API response
}

export default function EmployeeRequests() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connectedAt] = useState<string>(() => new Date().toLocaleString());
  const [lastFetchStatus, setLastFetchStatus] = useState<string | null>(null);

  // fetchRequests is extracted so we can call it from buttons as well
  const fetchRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(endpoints.requests.getAll, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });

      setLastFetchStatus(`${response.status} ${response.statusText}`);

      if (response.status === 404) {
        // Backend doesn't expose this endpoint yet. Show friendly message and empty list.
        setRequests([]);
        setError('Requests endpoint not found on backend (404).');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch requests');
      }

      const data = await response.json();
      setRequests(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreateRequest = async (requestData: any) => {
    try {
      const response = await fetch(endpoints.requests.create, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      if (response.status === 404) {
        setError('Requests endpoint not found on backend (404). Cannot create request.');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to create request');
      }

      // Refresh requests list
      const data = await response.json();
      setRequests(prev => [...prev, data]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create request');
    }
  };

  const handleAddMock = () => {
    const mock: Request = { id: `mock-${Date.now()}`, title: 'Sample request (mock)', status: 'pending', createdAt: new Date().toISOString() };
    setRequests(prev => [mock, ...prev]);
    setError(null);
  };

  return (
    <div className="requests-container">
      <h1>My Requests</h1>

      <div style={{ marginBottom: 12 }}>
        <strong>Frontend connected at:</strong> {connectedAt}
        {lastFetchStatus && <span style={{ marginLeft: 12 }}><strong>Last fetch:</strong> {lastFetchStatus}</span>}
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <button className="btn btn-primary" onClick={() => handleCreateRequest({ title: `Quick request ${new Date().toLocaleString()}` })}>
          New Request (try POST)
        </button>
        <button className="btn" onClick={handleAddMock}>Add Mock</button>
        <button className="btn" onClick={fetchRequests}>Retry Fetch</button>
      </div>

      {loading && <div>Loading requests…</div>}
      {error && <div className="notice error">{error}</div>}

      <div className="requests-list">
        {requests.length === 0 && !loading && <div>No requests to show.</div>}
        {requests.map(request => (
          <div key={request.id} className="request-card">
            <h3>{request.title}</h3>
            <p>Status: {request.status}</p>
            <p>Created: {new Date(request.createdAt).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}