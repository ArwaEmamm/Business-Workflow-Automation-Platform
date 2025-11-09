import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Descriptions, Timeline, Tag, List, Space, Typography, message } from 'antd';
import { ArrowLeftOutlined, DownloadOutlined } from '@ant-design/icons';
import './EmployeeRequestDetail.css';
import { endpoints } from '../../api/apiEndpoints';
import type { Request } from '../../types/request.types';

const { Title, Text } = Typography;

export default function EmployeeRequestDetail() {
  const { requestId } = useParams<{ requestId: string }>();
  const navigate = useNavigate();
  const [request, setRequest] = useState<Request | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRequest() {
      if (!requestId) {
        message.error('رقم الطلب غير موجود');
        navigate('/employee/requests');
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(endpoints.requests.getById(requestId), {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
        });

        if (!response.ok) {
          throw new Error('فشل في تحميل تفاصيل الطلب');
        }

        const data = await response.json();
        setRequest(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'حدث خطأ أثناء تحميل تفاصيل الطلب';
        setError(errorMessage);
        message.error(errorMessage);
      } finally {
        setLoading(false);
      }
    }

    fetchRequest();
  }, [requestId, navigate]);

  if (loading) {
    return <Card loading />;
  }

  if (error || !request) {
    return (
      <Card>
        <Space direction="vertical">
          <Text type="danger">{error || 'الطلب غير موجود'}</Text>
          <Button 
            type="primary" 
            onClick={() => navigate('/employee/requests')}
          >
            عودة للطلبات
          </Button>
        </Space>
      </Card>
    );
  }

  return (
    <div className="request-detail-page">
      <Card>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Space className="header-actions">
            <Button 
              icon={<ArrowLeftOutlined />} 
              onClick={() => navigate('/employee/requests')}
            >
              عودة للطلبات
            </Button>
          </Space>

          <Typography.Title level={2}>
            {request.title}
            <Tag 
              color={
                request.status === 'approved' ? 'success' :
                request.status === 'rejected' ? 'error' :
                'warning'
              }
              style={{ marginLeft: 8 }}
            >
              {request.status}
            </Tag>
          </Typography.Title>

          <Descriptions title="تفاصيل الطلب" bordered>
            <Descriptions.Item label="نوع الطلب">{request.workflowName || 'غير محدد'}</Descriptions.Item>
            <Descriptions.Item label="الحالة الحالية">
              {request.currentStep !== undefined ? 
                `الخطوة ${request.currentStep + 1}${request.steps ? ` من ${request.steps.length}` : ''}` : 
                'غير محدد'}
            </Descriptions.Item>
            <Descriptions.Item label="تاريخ الإنشاء">
              {new Date(request.createdAt).toLocaleDateString('ar')}
            </Descriptions.Item>
            <Descriptions.Item label="تم الإنشاء بواسطة">
              {request.createdBy?.name || 'غير محدد'}
            </Descriptions.Item>
            <Descriptions.Item label="آخر تحديث">
              {request.updatedAt ? new Date(request.updatedAt).toLocaleDateString('ar') : 'غير محدد'}
            </Descriptions.Item>
            <Descriptions.Item label="الوصف" span={3}>
              {request.description || 'لا يوجد وصف'}
            </Descriptions.Item>
          </Descriptions>

          {request.attachments && request.attachments.length > 0 && (
            <Card title="المرفقات" size="small">
              <List
                dataSource={request.attachments}
                renderItem={(attachment) => (
                  <List.Item
                    key={attachment.id}
                    actions={[
                      <Button
                        type="link"
                        icon={<DownloadOutlined />}
                        href={attachment.url}
                        target="_blank"
                      >
                        تحميل
                      </Button>
                    ]}
                  >
                    <List.Item.Meta
                      title={attachment.filename}
                      description={`${(attachment.size / 1024 / 1024).toFixed(2)} MB`}
                    />
                  </List.Item>
                )}
              />
            </Card>
          )}

          {request.steps && request.steps.length > 0 && (
            <Card title="مراحل الطلب" size="small">
              <Timeline>
                {request.steps.map((step, index) => (
                  <Timeline.Item
                    key={step.id}
                    color={
                      index < (request.currentStep || 0) ? 'green' :
                      index === (request.currentStep || 0) ? 'blue' :
                      'gray'
                    }
                  >
                    <Typography.Text strong>{step.title}</Typography.Text>
                    <br />
                    <Typography.Text type="secondary">
                      {`المسؤول: ${step.assignedRole}`}
                    </Typography.Text>
                  </Timeline.Item>
                ))}
              </Timeline>
            </Card>
          )}

          {request.approvals && request.approvals.length > 0 && (
            <Card title="سجل الموافقات" size="small">
              <Timeline>
                {request.approvals.map((approval) => (
                  <Timeline.Item
                    key={approval.id}
                    color={approval.decision === 'approved' ? 'green' : 'red'}
                  >
                    <Typography.Text strong>
                      {approval.decision === 'approved' ? 'تمت الموافقة' : 'تم الرفض'}
                    </Typography.Text>
                    <br />
                    <Typography.Text type="secondary">
                      {`بواسطة: ${approval.approvedBy.name} (${approval.approvedBy.role})`}
                      <br />
                      {`التاريخ: ${new Date(approval.approvedAt).toLocaleDateString('ar')}`}
                    </Typography.Text>
                    {approval.comment && (
                      <Card size="small" style={{ marginTop: 8 }}>
                        {approval.comment}
                      </Card>
                    )}
                  </Timeline.Item>
                ))}
              </Timeline>
            </Card>
          )}
        </Space>
      </Card>
    </div>
  );
}
