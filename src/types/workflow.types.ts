export interface WorkflowStep {
  title: string;
  order: number;
  assignedRole: 'employee' | 'manager' | 'hr_manager';
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export interface Workflow {
  id?: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  createdAt?: string;
  updatedAt?: string;
  createdBy?: User | string;
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