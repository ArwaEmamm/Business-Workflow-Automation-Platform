import React, { useEffect, useState } from 'react';
import { Modal, Descriptions, Timeline, Card, Button, Tag, message, List, Space } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { endpoints } from '../../api/apiEndpoints';

interface EmployeeRequestDetailProps {
  requestId: string;
  visible: boolean;
  onClose: () => void;
}

const EmployeeRequestDetail: React.FC<EmployeeRequestDetailProps> = ({ requestId, visible, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any | null>(null);

  const fetchDetail = async () => {
    setLoading(true);
    try {
      const res = await fetch(endpoints.requests.getById(requestId), {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
      });
      if (!res.ok) throw new Error('Failed to fetch request detail');
      const json = await res.json();
      setData(json);
    } catch (err) {
      message.error((err as Error).message || 'Failed to load request');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible) fetchDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, requestId]);

  return (
    <Modal title={`Request ${requestId}`} open={visible} onCancel={onClose} footer={null} width={800}>
      {loading && <div>Loading...</div>}
      {!loading && !data && <div>No data available</div>}

      {data && (
        <div>
          <Card style={{ marginBottom: 12 }}>
            <Descriptions column={1} bordered>
              <Descriptions.Item label="Title">{data.title}</Descriptions.Item>
              <Descriptions.Item label="Description">{data.description || '-'}</Descriptions.Item>
              <Descriptions.Item label="Workflow">{data.workflowName || data.workflowId}</Descriptions.Item>
              <Descriptions.Item label="Status"><Tag color={data.status === 'approved' ? 'green' : data.status === 'rejected' ? 'red' : 'orange'}>{data.status}</Tag></Descriptions.Item>
              <Descriptions.Item label="Created By">{typeof data.createdBy === 'string' ? data.createdBy : data.createdBy?.name}</Descriptions.Item>
              <Descriptions.Item label="Created At">{data.createdAt ? new Date(data.createdAt).toLocaleString() : '-'}</Descriptions.Item>
            </Descriptions>
          </Card>

          <Card title="Workflow Steps" style={{ marginBottom: 12 }}>
            <Timeline mode="left">
              {(data.steps || []).map((s: any, idx: number) => (
                <Timeline.Item key={idx} label={`Step ${s.order}`}>{s.title} — {s.assignedRole}</Timeline.Item>
              ))}
            </Timeline>
          </Card>

          <Card title="Approvals History">
            <Timeline>
              {(data.history || []).map((h: any, i: number) => (
                <Timeline.Item key={i}>{h.user?.name || h.user} — {h.decision} — {new Date(h.at).toLocaleString()} {h.comment ? `— ${h.comment}` : ''}</Timeline.Item>
              ))}
            </Timeline>
          </Card>

          {data.attachments && data.attachments.length > 0 && (
            <Card title="المرفقات" size="small" style={{ marginTop: 12 }}>
              <List
                dataSource={data.attachments}
                renderItem={(attachment: any) => (
                  <List.Item
                    key={attachment.filename}
                    actions={[
                      <Button
                        type="link"
                        icon={<DownloadOutlined />}
                        onClick={() => window.open(`/uploads/${attachment.filename}`, '_blank')}
                      >
                        تحميل
                      </Button>
                    ]}
                  >
                    <List.Item.Meta
                      title={attachment.originalname}
                      description={`${(attachment.size / 1024 / 1024).toFixed(2)} MB`}
                    />
                  </List.Item>
                )}
              />
            </Card>
          )}

          <div style={{ marginTop: 12, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <Button onClick={onClose} disabled={loading}>Close</Button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default EmployeeRequestDetail;
