import React from 'react';
import { Modal, Descriptions, Tag, Timeline, Typography, Card } from 'antd';
import { ClockCircleOutlined, UserOutlined } from '@ant-design/icons';
import type { Workflow } from '../../types/workflow.types';

const { Text } = Typography;

interface WorkflowDetailProps {
  workflow: Workflow;
  onClose: () => void;
  visible: boolean;
}

const WorkflowDetail: React.FC<WorkflowDetailProps> = ({ workflow, onClose, visible }) => {
  const getRoleColor = (role: string): string => {
    switch (role.toLowerCase()) {
      case 'admin': return 'red';
      case 'manager': return 'orange';
      case 'employee': return 'blue';
      default: return 'default';
    }
  };

  const createdByName = typeof workflow.createdBy === 'object' 
    ? workflow.createdBy.name 
    : (workflow.createdBy || 'Unknown');

  return (
    <Modal
      title="Workflow Details"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={700}
    >
      <Card className="workflow-info" style={{ marginBottom: 16 }}>
        <Descriptions column={1}>
          <Descriptions.Item label="Name">
            <Text strong>{workflow.name}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Description">
            {workflow.description || 'No description provided'}
          </Descriptions.Item>
          <Descriptions.Item label="Created By">
            <UserOutlined /> {createdByName}
          </Descriptions.Item>
          {workflow.createdAt && (
            <Descriptions.Item label="Created At">
              <ClockCircleOutlined /> {new Date(workflow.createdAt).toLocaleString()}
            </Descriptions.Item>
          )}
        </Descriptions>
      </Card>

      <Card title={`Workflow Steps (${workflow.steps?.length || 0})`}>
        <Timeline mode="left">
          {workflow.steps?.map((step, index) => (
            <Timeline.Item
              key={`${index}-${step.title}`}
              label={`Step ${step.order}`}
              dot={<div className="step-number">{step.order}</div>}
            >
              <div style={{ marginBottom: 8 }}>
                <Text strong>{step.title}</Text>
              </div>
              <Tag color={getRoleColor(step.assignedRole)}>
                {step.assignedRole}
              </Tag>
            </Timeline.Item>
          ))}
        </Timeline>
      </Card>
    </Modal>
  );
};

export default WorkflowDetail;
