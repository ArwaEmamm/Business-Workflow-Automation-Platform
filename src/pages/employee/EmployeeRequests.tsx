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
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        message.error('Please login first');
        return;
      }

      const response = await fetch(endpoints.requests.getAll, {
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
      console.log('API Response:', data);

      // Normalize the response data - show all requests, not just recent ones
      const normalizedRequests = Array.isArray(data) ? data : data.requests || data.data || [];
      const requests = normalizedRequests.map((r: any) => ({
        id: r.id || r._id,
        title: r.title,
        description: r.description || '',
        status: r.status,
        createdAt: r.createdAt,
        workflowId: r.workflowId,
        workflowName: r.workflowName || r.workflow?.name,
        currentStep: r.currentStep,
        attachments: r.attachments || []
      }));

      console.log('Normalized Requests:', requests);
      setRequests(requests);
    } catch (err) {
      console.error('Error fetching requests:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error loading requests';
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