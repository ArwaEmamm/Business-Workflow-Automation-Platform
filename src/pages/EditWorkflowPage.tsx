import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import type { RootState } from '../app/store';
import type { Workflow } from '../types/workflow.types';
import { updateWorkflow, fetchWorkflowById } from '../features/workflows/workflowsSlice';
import { WorkflowForm } from '../components/workflows/WorkflowForm';
import type { WorkflowFormData } from '../types/workflow.types';

export const EditWorkflowPage = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { workflows } = useAppSelector((state: RootState) => state.workflows);
  const workflow = workflows.find((w: Workflow) => ((w as any).id ?? (w as any)._id) === id);
  const currentWorkflow = useAppSelector((state: RootState) => state.workflows.currentWorkflow);

  useEffect(() => {
    if (!workflow && id) {
      // try fetching the individual workflow if it's not in the list
      dispatch(fetchWorkflowById(id));
    }
  }, [id, workflow, dispatch]);

  const handleSubmit = async (values: WorkflowFormData) => {
    if (id) {
      await dispatch(updateWorkflow({ id, workflow: values })).unwrap();
    }
  };

  const source = workflow || currentWorkflow;

  if (!source) {
    return <div>Loading...</div>;
  }

  const initialValues: WorkflowFormData = {
    name: source.name,
    description: source.description,
    steps: source.steps
  };

  return (
    <div className="edit-workflow-page">
      <h1>Edit Workflow</h1>
      <WorkflowForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        isEdit
      />
    </div>
  );
};