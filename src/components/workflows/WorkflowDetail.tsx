import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Steps, Button, Space } from 'antd';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import type { RootState } from '../../app/store';
import { fetchWorkflowById } from '../../features/workflows/workflowsSlice';

export const WorkflowDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentWorkflow, status, error } = useAppSelector((state: RootState) => state.workflows);

  useEffect(() => {
    if (id && (!currentWorkflow || currentWorkflow.id !== id)) {
      dispatch(fetchWorkflowById(id));
    }
  }, [id, currentWorkflow, dispatch]);

  if (status === 'loading' || !currentWorkflow) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="workflow-detail">
      <Card title={currentWorkflow.name} extra={
        <Space>
          <Button onClick={() => navigate('/workflows')}>Back</Button>
          <Button type="primary" onClick={() => navigate(`/workflows/edit/${id}`)}>
            Edit
          </Button>
        </Space>
      }>
        <p>{currentWorkflow.description}</p>
        
        <h3>Approval Steps</h3>
        <Steps
          direction="vertical"
          current={-1}
          items={currentWorkflow.steps.map((step: any) => ({
              title: step.title,
              description: `Assigned to: ${step.assignedRole}`,
            }))}
        />
      </Card>
    </div>
  );
};