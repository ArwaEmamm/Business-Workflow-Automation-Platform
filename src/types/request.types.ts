export interface RequestAttachment {
  id: string;
  filename: string;
  url: string;
  size: number;
  uploadedAt: string;
}

export interface RequestApproval {
  id: string;
  stepId: string;
  approvedBy: {
    id: string;
    name: string;
    role: string;
  };
  decision: 'approved' | 'rejected';
  comment?: string;
  approvedAt: string;
}

export interface Request {
  id: string;
  _id?: string;
  title: string;
  description: string;
  workflowId: string;
  workflowName?: string;
  status: 'pending' | 'approved' | 'rejected';
  currentStep?: number;
  createdBy?: {
    id: string;
    name: string;
    role: string;
  };
  createdAt: string;
  updatedAt?: string;
  attachments?: RequestAttachment[];
  approvals?: RequestApproval[];
  steps?: {
    id: string;
    title: string;
    order: number;
  assignedRole: 'manager' | 'hr_manager';
    status: 'pending' | 'approved' | 'rejected';
  }[];
}

export interface RequestFormData {
  title: string;
  description: string;
  workflowId: string;
  attachments?: File[];
}

export interface RequestFilters {
  status?: string;
  workflowId?: string;
  createdBy?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export interface ApproveRequestData {
  decision: 'approved' | 'rejected';
  comment?: string;
}
