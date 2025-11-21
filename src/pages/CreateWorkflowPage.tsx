import { useAppDispatch } from '../app/hooks';
import { createWorkflow } from '../features/workflows/workflowsSlice';
import { WorkflowForm } from '../components/workflows/WorkflowForm';
import type { WorkflowFormData } from '../types/workflow.types';
import './CreateWorkflowPage.css';

export const CreateWorkflowPage = () => {
  const dispatch = useAppDispatch();

  const handleSubmit = async (values: WorkflowFormData) => {
    await dispatch(createWorkflow(values)).unwrap();
  };

  return (
    <div className="create-workflow-page">
      <div className="create-workflow-container">
        <div className="create-workflow-header">
          <h1 className="create-workflow-title">Create New Workflow</h1>
          <p className="create-workflow-subtitle">Design and configure a new workflow for your team</p>
        </div>
        <WorkflowForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
};