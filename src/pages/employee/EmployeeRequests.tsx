import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { FaPlus } from 'react-icons/fa';
import { endpoints } from '../../api/apiEndpoints';
import EmployeeRequestDetail from '../../components/requests/EmployeeRequestDetail';
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
        setError('يرجى تسجيل الدخول أولاً');
        return;
      }

      const response = await fetch(endpoints.users.getAllRequests, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          setRequests([]);
          setError('لم يتم العثور على الطلبات');
          return;
        }
        throw new Error('فشل في جلب الطلبات');
      }

      const data = await response.json();
      
      // Normalize the response data
      const normalizedRequests = Array.isArray(data) ? data : data.requests || [];
      const requests = normalizedRequests.map((r: any) => ({
        id: r.id || r._id,
        title: r.title,
        description: r.description || '',
        status: r.status,
        createdAt: r.createdAt,
        workflowId: r.workflowId,
        workflowName: r.workflowName || r.workflow?.name
      }));
      
      setRequests(requests);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ أثناء جلب الطلبات');
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

      <section className="recent-requests-card">
        <div className="recent-table-wrap">
          <table className="recent-table">
            <thead>
              <tr>
                <th>WORKFLOW</th>
                <th>DATE</th>
                <th>STATUS</th>
                <th>CURRENT STEP</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r.id}>
                  <td>{r.workflowName || '-'}</td>
                  <td>{new Date(r.createdAt).toLocaleString()}</td>
                  <td><span className={`status-pill ${r.status}`}>{r.status}</span></td>
                  <td>{r.currentStep || '-'}</td>
                  <td>
                    <Button
                      type="link"
                      icon={<EyeOutlined />}
                      onClick={() => handleViewRequest(r.id)}
                    >
                      View Details
                    </Button>
                  </td>
                </tr>
              ))}
              {requests.length === 0 && !loading && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center' }}>No requests found</td>
                </tr>
              )}
              {loading && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center' }}>
                    <div className="loading-spinner">Loading...</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <EmployeeRequestDetail
        requestId={selectedRequestId || ''}
        visible={isModalVisible}
        onClose={() => {
          setIsModalVisible(false);
          setSelectedRequestId(null);
        }}
      />
    </div>
  );
}