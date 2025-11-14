import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, message } from 'antd';
import { FaPlus } from 'react-icons/fa';
import { endpoints } from '../../api/apiEndpoints';
import EmployeeRequestDetail from '../../components/requests/EmployeeRequestDetail';
import RequestsTable from '../../components/requests/RequestsTable';
import './EmployeeRequests.css';

interface Request {
  id: string;
  _id?: string;
  title: string;
  description: string;
  status: string;
  currentStep?: number;
  createdAt: string;
  workflowId: string;
  workflowName?: string;
  attachments?: {
    filename: string;
    originalname: string;
    mimetype: string;
    path: string;
    size: number;
  }[];
  workflow?: {
    id: string;
    name: string;
  };
}

export default function EmployeeRequests() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);

  const fetchRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setError('Please login first');
        return;
      }

      // Use dashboard endpoint to get user's own requests
      const response = await fetch(endpoints.dashboard, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        console.error('API Error:', response.status, response.statusText);
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error('Failed to fetch requests');
      }

      const data = await response.json();
      console.log('Dashboard API Response:', data);

      // Get all requests from dashboard response (not just recent ones)
      // The dashboard endpoint returns user's own requests
      let allRequests: any[] = [];

      if (data.recentRequests && Array.isArray(data.recentRequests)) {
        allRequests = data.recentRequests;
      } else if (data.requests && Array.isArray(data.requests)) {
        allRequests = data.requests;
      } else if (Array.isArray(data)) {
        allRequests = data;
      }

      const requests = allRequests.map((r: any) => ({
        id: r.id || r._id,
        title: r.title || r.data?.title || 'Untitled',
        description: r.description || r.data?.description || '',
        status: r.status || r.data?.status || 'pending',
        createdAt: r.createdAt || r.data?.createdAt,
        workflowId: r.workflowId || r.workflow?.id || r.data?.workflow?.id,
        workflowName: r.workflowName || r.workflow?.name || r.data?.workflow?.name,
        currentStep: r.currentStep !== undefined ? r.currentStep : (r.data?.currentStep || 0),
        attachments: r.attachments || r.data?.attachments || []
      }));

      console.log('Normalized Requests:', requests);
      setRequests(requests);
    } catch (err) {
      console.error('Error fetching requests:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error loading requests';
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleViewRequest = (requestId: string) => {
    setSelectedRequestId(requestId);
    setIsModalVisible(true);
  };

  return (
    <div className="requests-container">
      <div className="page-header">
        <h1>My Requests</h1>
        <Button 
          type="primary"
          icon={<FaPlus />}
          onClick={() => navigate('/employee/create-request')}
        >
          New Request
        </Button>
      </div>

      <div className="recent-requests-card">
        <RequestsTable 
          requests={requests} 
          loading={loading} 
          showAllRequests 
          onViewRequest={handleViewRequest} 
        />
      </div>

      {selectedRequestId && (
        <EmployeeRequestDetail 
          requestId={selectedRequestId}
          visible={isModalVisible}
          onClose={() => {
            setIsModalVisible(false);
            setSelectedRequestId(null);
            // Refresh the requests list after closing the modal
            fetchRequests();
          }}
        />
      )}
    </div>
  );
}