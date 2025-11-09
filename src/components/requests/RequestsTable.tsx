import { Link } from 'react-router-dom';
import { Button } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import './RequestsTable.css';

interface RequestItem {
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

interface RequestsTableProps {
  requests: RequestItem[];
  loading?: boolean;
  showAllRequests?: boolean;
  onViewRequest?: (requestId: string) => void;
}

const RequestsTable: React.FC<RequestsTableProps> = ({ requests, loading = false, showAllRequests = false, onViewRequest }) => {
  return (
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
              <td>{r.createdAt ? new Date(r.createdAt).toLocaleString() : '-'}</td>
              <td><span className={`status-pill ${r.status}`}>{r.status}</span></td>
              <td>{r.currentStep || '-'}</td>
              <td>
                {onViewRequest ? (
                  <Button
                    type="link"
                    icon={<EyeOutlined />}
                    onClick={() => onViewRequest(r.id)}
                  >
                    View Details
                  </Button>
                ) : (
                  <Link to={`/employee/requests/${r.id}`} className="action-link">
                    View Details
                  </Link>
                )}
              </td>
            </tr>
          ))}
          {requests.length === 0 && !loading && (
            <tr>
              <td colSpan={5} style={{ textAlign: 'center' }}>
                {showAllRequests ? 'No requests found' : 'No recent requests'}
              </td>
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
  );
};

export default RequestsTable;
