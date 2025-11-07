import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import type { RootState } from '../../app/store';
import { fetchRequestById, approveRequest, forceApproveRequest, forceRejectRequest } from '../../features/requests/requestsSlice';
import { Button, Card, Descriptions, Tabs, Tag, Timeline, List, Modal, Form, Input, message, Space } from 'antd';
import type { Request, ApproveRequestData } from '../../types/request.types';
import { CheckCircleOutlined, CloseCircleOutlined, DownloadOutlined, CommentOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { TabPane } = Tabs;
const { TextArea } = Input;

export const RequestDetail = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { currentRequest, status } = useAppSelector((state: RootState) => state.requests);
  const [approveModalVisible, setApproveModalVisible] = useState(false);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (id) {
      dispatch(fetchRequestById(id));
    }
  }, [id, dispatch]);

  const handleApprove = async (values: ApproveRequestData) => {
    if (!id) return;

    try {
      await dispatch(approveRequest({ id, data: values })).unwrap();
      message.success('Request approved successfully');
      setApproveModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('Failed to approve request');
    }
  };

  const handleForceApprove = async () => {
    if (!id) return;

    Modal.confirm({
      title: 'Force Approve Request',
      content: 'Are you sure you want to force approve this request? This will bypass the normal workflow.',
      onOk: async () => {
        try {
          await dispatch(forceApproveRequest(id)).unwrap();
          message.success('Request force approved successfully');
        } catch (error) {
          message.error('Failed to force approve request');
        }
      }
    });
  };

  const handleForceReject = async () => {
    if (!id) return;

    Modal.confirm({
      title: 'Force Reject Request',
      content: 'Are you sure you want to force reject this request? This will bypass the normal workflow.',
      onOk: async () => {
        try {
          await dispatch(forceRejectRequest(id)).unwrap();
          message.success('Request force rejected successfully');
        } catch (error) {
          message.error('Failed to force reject request');
        }
      }
    });
  };

  const handleAddComment = async (values: { comment: string }) => {
    // TODO: Implement add comment API
    message.success('Comment added successfully');
    setCommentModalVisible(false);
    form.resetFields();
  };

  const downloadAttachment = async (attachmentId: string, filename: string) => {
    // TODO: Implement download attachment
    message.info('Download functionality to be implemented');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'orange';
      case 'approved': return 'green';
      case 'rejected': return 'red';
      default: return 'default';
    }
  };

  if (!currentRequest) {
    return <div>Loading...</div>;
  }

  const currentStepData = currentRequest.steps.find(s => s.order === currentRequest.currentStep);

  return (
    <div className="request-detail">
      <div className="request-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <h1>Request #{currentRequest.id?.slice(-8)}</h1>
          <Tag color={getStatusColor(currentRequest.status)}>{currentRequest.status.toUpperCase()}</Tag>
        </div>
        <Space>
          <Button icon={<CommentOutlined />} onClick={() => setCommentModalVisible(true)}>
            Add Comment
          </Button>
          <Button type="primary" onClick={() => setApproveModalVisible(true)}>
            Approve
          </Button>
          <Button danger onClick={() => setRejectModalVisible(true)}>
            Reject
          </Button>
          <Button icon={<CheckCircleOutlined />} onClick={handleForceApprove}>
            Force Approve
          </Button>
          <Button icon={<CloseCircleOutlined />} danger onClick={handleForceReject}>
            Force Reject
          </Button>
        </Space>
      </div>

      <Tabs defaultActiveKey="details">
        <TabPane tab="Details" key="details">
          <Card title="Request Information">
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Title">{currentRequest.title}</Descriptions.Item>
              <Descriptions.Item label="Workflow">{currentRequest.workflowName}</Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={getStatusColor(currentRequest.status)}>{currentRequest.status.toUpperCase()}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Current Step">
                {currentStepData ? `${currentRequest.currentStep}. ${currentStepData.title}` : currentRequest.currentStep}
              </Descriptions.Item>
              <Descriptions.Item label="Created By">{currentRequest.createdBy.name}</Descriptions.Item>
              <Descriptions.Item label="Created At">
                {dayjs(currentRequest.createdAt).format('YYYY-MM-DD HH:mm:ss')}
              </Descriptions.Item>
              <Descriptions.Item label="Updated At" span={2}>
                {dayjs(currentRequest.updatedAt).format('YYYY-MM-DD HH:mm:ss')}
              </Descriptions.Item>
              <Descriptions.Item label="Description" span={2}>
                {currentRequest.description}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </TabPane>

        <TabPane tab="Workflow Steps" key="steps">
          <Card title="Workflow Progress">
            <Timeline>
              {currentRequest.steps.map((step, index) => {
                const isCompleted = step.order < currentRequest.currentStep;
                const isCurrent = step.order === currentRequest.currentStep;
                const isPending = step.order > currentRequest.currentStep;

                let color = 'gray';
                if (isCompleted) color = 'green';
                else if (isCurrent) color = 'blue';
                else if (isPending) color = 'gray';

                return (
                  <Timeline.Item
                    key={step.order}
                    color={color}
                    label={step.assignedRole}
                  >
                    <div>
                      <strong>{step.order}. {step.title}</strong>
                      {isCurrent && <Tag color="blue" style={{ marginLeft: 8 }}>Current</Tag>}
                      {isCompleted && <Tag color="green" style={{ marginLeft: 8 }}>Completed</Tag>}
                    </div>
                  </Timeline.Item>
                );
              })}
            </Timeline>
          </Card>
        </TabPane>

        <TabPane tab="Approval History" key="history">
          <Card title="Approval History">
            <Timeline>
              {currentRequest.approvals?.map((approval, index) => (
                <Timeline.Item
                  key={index}
                  color={approval.status === 'approved' ? 'green' : 'red'}
                  label={`${approval.approvedBy.name} - ${dayjs(approval.approvedAt).format('YYYY-MM-DD HH:mm')}`}
                >
                  <div>
                    <strong>Step {approval.step}: {approval.stepTitle}</strong>
                    <br />
                    Status: <Tag color={approval.status === 'approved' ? 'green' : 'red'}>
                      {approval.status.toUpperCase()}
                    </Tag>
                    {approval.comment && (
                      <div style={{ marginTop: 8 }}>
                        <strong>Comment:</strong> {approval.comment}
                      </div>
                    )}
                  </div>
                </Timeline.Item>
              )) || (
                <Timeline.Item color="gray">
                  No approvals yet
                </Timeline.Item>
              )}
            </Timeline>
          </Card>
        </TabPane>

        <TabPane tab="Attachments" key="attachments">
          <Card title="Attachments">
            <List
              dataSource={currentRequest.attachments || []}
              renderItem={(attachment) => (
                <List.Item
                  actions={[
                    <Button
                      key="download"
                      icon={<DownloadOutlined />}
                      onClick={() => downloadAttachment(attachment.id, attachment.filename)}
                    >
                      Download
                    </Button>
                  ]}
                >
                  <List.Item.Meta
                    title={attachment.filename}
                    description={`Uploaded on ${dayjs(attachment.uploadedAt).format('YYYY-MM-DD HH:mm')} by ${attachment.uploadedBy.name}`}
                  />
                  <div>{attachment.size} bytes</div>
                </List.Item>
              )}
            />
            {(!currentRequest.attachments || currentRequest.attachments.length === 0) && (
              <div style={{ textAlign: 'center', padding: 20, color: '#999' }}>
                No attachments
              </div>
            )}
          </Card>
        </TabPane>
      </Tabs>

      {/* Approve Modal */}
      <Modal
        title="Approve Request"
        open={approveModalVisible}
        onCancel={() => setApproveModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleApprove} layout="vertical">
          <Form.Item
            name="comment"
            label="Comment (optional)"
            rules={[{ max: 500, message: 'Comment cannot exceed 500 characters' }]}
          >
            <TextArea rows={4} placeholder="Add a comment for this approval..." />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Approve
              </Button>
              <Button onClick={() => setApproveModalVisible(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Reject Modal */}
      <Modal
        title="Reject Request"
        open={rejectModalVisible}
        onCancel={() => setRejectModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={(values) => handleApprove({ ...values, status: 'rejected' })} layout="vertical">
          <Form.Item
            name="comment"
            label="Reason for rejection"
            rules={[{ required: true, message: 'Please provide a reason for rejection' }]}
          >
            <TextArea rows={4} placeholder="Please explain why this request is being rejected..." />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button danger htmlType="submit">
                Reject
              </Button>
              <Button onClick={() => setRejectModalVisible(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Add Comment Modal */}
      <Modal
        title="Add Comment"
        open={commentModalVisible}
        onCancel={() => setCommentModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleAddComment} layout="vertical">
          <Form.Item
            name="comment"
            label="Comment"
            rules={[{ required: true, message: 'Please enter a comment' }]}
          >
            <TextArea rows={4} placeholder="Add your comment..." />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Add Comment
              </Button>
              <Button onClick={() => setCommentModalVisible(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
