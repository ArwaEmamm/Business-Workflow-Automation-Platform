interface WorkflowStep {
  title: string;
  order: number;
  assignedRole: 'admin' | 'manager' | 'employee';
}

export interface Workflow {
  id?: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface WorkflowFormData {
  name: string;
  description: string;
  steps: WorkflowStep[];
}

export const defaultWorkflow: WorkflowFormData = {
  name: '',
  description: '',
  steps: [
    {
      title: '',
      order: 1,
      assignedRole: 'manager'
    }
  ]
};