import { useAppDispatch } from '../app/hooks';
import { createWorkflow } from '../features/workflows/workflowsSlice';
import { WorkflowForm } from '../components/workflows/WorkflowForm';
import type { WorkflowFormData } from '../types/workflow.types';

export const CreateWorkflowPage = () => {
  const dispatch = useAppDispatch();

  const handleSubmit = async (values: WorkflowFormData) => {
    await dispatch(createWorkflow(values)).unwrap();
  };

  return (
    <div className="create-workflow-page">
      <h1>Create Workflow</h1>
      <WorkflowForm onSubmit={handleSubmit} />
    </div>
  );
};