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
    if (!requestId) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log('Fetching request detail for ID:', requestId);
      console.log('Using token:', token.substring(0, 20) + '...');

      const res = await fetch(endpoints.requests.getById(requestId), {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      console.log('Response status:', res.status, res.statusText);

      if (res.status === 403) {
        console.error('403 Forbidden - Check user permissions and token validity');
        const errorText = await res.text();
        console.error('403 Error Response:', errorText);
        message.error('Access denied. You may not have permission to view this request.');
        throw new Error('Access denied');
      }

      if (!res.ok) {
        console.error('API Error:', res.status, res.statusText);
        const errorText = await res.text();
        console.error('API Error Response:', errorText);
        throw new Error('Failed to fetch request detail');
      }

      const json = await res.json();
      console.log('Request Detail API Response:', json);

      if (!json || (!json.data && !json.title)) {
        throw new Error('Invalid request data received');
      }

      // Normalize the response structure
      const requestData = json.data || json;
      setData(requestData);
    } catch (err) {
      console.error('Error fetching request detail:', err);
      message.error(err instanceof Error ? err.message : 'Failed to load request details');
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
    <Modal
      title={data ? data.title : `Request ${requestId}`}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={900}
      loading={loading}
    >
      {loading && <div style={{ textAlign: 'center', padding: '20px' }}>Loading...</div>}
      {!loading && !data && <div style={{ textAlign: 'center', padding: '20px' }}>No data available</div>}

      {data && (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Card size="small" title="Request Information">
            <Descriptions column={2} bordered size="middle">
              <Descriptions.Item label={<strong>العنوان / Title</strong>} span={2}>
                <span style={{ fontSize: '15px' }}>{data.title || 'No title'}</span>
              </Descriptions.Item>
              <Descriptions.Item label={<strong>نوع الطلب / Workflow</strong>}>
                <span style={{ fontSize: '15px' }}>{data.workflowName || data.workflow?.name || data.workflowId || 'Not specified'}</span>
              </Descriptions.Item>
              <Descriptions.Item label={<strong>الحالة / Status</strong>}>
                <Tag
                  color={data.status === 'approved' ? 'green' : data.status === 'rejected' ? 'red' : 'orange'}
                  style={{ fontSize: '13px', padding: '4px 12px' }}
                >
                  {data.status?.toUpperCase() || 'PENDING'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label={<strong>الوصف / Description</strong>} span={2}>
                <div style={{ fontSize: '14px', whiteSpace: 'pre-wrap' }}>
                  {data.description || 'No description provided'}
                </div>
              </Descriptions.Item>
              <Descriptions.Item label={<strong>تم الإنشاء بواسطة / Created By</strong>}>
                {typeof data.createdBy === 'string' ? data.createdBy : data.createdBy?.name || 'Unknown'}
              </Descriptions.Item>
              <Descriptions.Item label={<strong>تاريخ الإنشاء / Created At</strong>}>
                {data.createdAt ? new Date(data.createdAt).toLocaleString('ar-EG', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                }) : '-'}
              </Descriptions.Item>
              {data.updatedAt && (
                <Descriptions.Item label={<strong>آخر تحديث / Last Updated</strong>}>
                  {new Date(data.updatedAt).toLocaleString('ar-EG', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </Descriptions.Item>
              )}
              <Descriptions.Item label={<strong>الخطوة الحالية / Current Step</strong>}>
                {data.currentStep !== undefined ? `Step ${data.currentStep + 1}${data.steps ? ` of ${data.steps.length}` : ''}` : 'Not started'}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {data.steps && data.steps.length > 0 && (
            <Card title="Workflow Steps" size="small">
              <Timeline>
                {data.steps.map((s: any, idx: number) => (
                  <Timeline.Item
                    key={s.id || idx}
                    color={
                      idx < (data.currentStep || 0) ? 'green' :
                      idx === (data.currentStep || 0) ? 'blue' :
                      'gray'
                    }
                  >
                    <div>
                      <strong>Step {s.order || idx + 1}: {s.title}</strong>
                      <br />
                      <span style={{ color: '#888' }}>Assigned to: {s.assignedRole}</span>
                      {s.status && (
                        <>
                          <br />
                          <Tag color={s.status === 'approved' ? 'green' : s.status === 'rejected' ? 'red' : 'orange'}>
                            {s.status}
                          </Tag>
                        </>
                      )}
                    </div>
                  </Timeline.Item>
                ))}
              </Timeline>
            </Card>
          )}

          {data.approvals && data.approvals.length > 0 && (
            <Card title="Approvals History" size="small">
              <Timeline>
                {data.approvals.map((approval: any, i: number) => (
                  <Timeline.Item
                    key={approval.id || i}
                    color={approval.decision === 'approved' ? 'green' : 'red'}
                  >
                    <div>
                      <strong>
                        {approval.decision === 'approved' ? '✓ Approved' : '✗ Rejected'}
                      </strong>
                      <br />
                      <span style={{ color: '#888' }}>
                        By: {approval.approvedBy?.name || 'Unknown'} ({approval.approvedBy?.role || 'N/A'})
                      </span>
                      <br />
                      <span style={{ color: '#888' }}>
                        Date: {approval.approvedAt ? new Date(approval.approvedAt).toLocaleString('ar-EG') : '-'}
                      </span>
                      {approval.comment && (
                        <Card size="small" style={{ marginTop: 8, backgroundColor: '#f5f5f5' }}>
                          <strong>Comment:</strong> {approval.comment}
                        </Card>
                      )}
                    </div>
                  </Timeline.Item>
                ))}
              </Timeline>
            </Card>
          )}

          {data.history && data.history.length > 0 && (
            <Card title="Request History" size="small">
              <Timeline>
                {data.history.map((h: any, i: number) => (
                  <Timeline.Item key={i}>
                    <div>
                      <strong>{h.user?.name || h.user || 'System'}</strong> — {h.decision || h.action}
                      <br />
                      <span style={{ color: '#888' }}>
                        {h.at ? new Date(h.at).toLocaleString('ar-EG') : '-'}
                      </span>
                      {h.comment && (
                        <>
                          <br />
                          <span style={{ fontStyle: 'italic' }}>{h.comment}</span>
                        </>
                      )}
                    </div>
                  </Timeline.Item>
                ))}
              </Timeline>
            </Card>
          )}

          {data.attachments && data.attachments.length > 0 && (
            <Card title="المرفقات / Attachments" size="small">
              <List
                dataSource={data.attachments}
                renderItem={(attachment: any, index: number) => {
                  const fileName = attachment.originalname || attachment.filename || `File ${index + 1}`;
                  const fileSize = attachment.size ? `${((attachment.size) / 1024 / 1024).toFixed(2)} MB` : 'Unknown size';
                  const fileUrl = attachment.url || attachment.path || `/uploads/${attachment.filename}`;

                  return (
                    <List.Item
                      key={attachment.id || attachment.filename || index}
                      actions={[
                        <Button
                          key="download"
                          type="link"
                          icon={<DownloadOutlined />}
                          onClick={() => {
                            window.open(fileUrl, '_blank');
                          }}
                        >
                          Download
                        </Button>
                      ]}
                    >
                      <List.Item.Meta
                        title={<strong>{fileName}</strong>}
                        description={
                          <div>
                            <div>Size: {fileSize}</div>
                            {attachment.mimetype && <div>Type: {attachment.mimetype}</div>}
                          </div>
                        }
                      />
                    </List.Item>
                  );
                }}
              />
            </Card>
          )}

          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <Button onClick={onClose} disabled={loading}>Close</Button>
          </div>
        </Space>
      )}
    </Modal>
  );
};

export default EmployeeRequestDetail;
