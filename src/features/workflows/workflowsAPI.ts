import { api } from '../api/apiEndpoints';
import type { WorkflowFormData } from '../../types/workflow.types';

export const workflowsApi = {
  create: async (workflow: WorkflowFormData) => {
    const response = await fetch(api.workflows.create, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      },
      body: JSON.stringify(workflow)
    });

    if (!response.ok) {
      throw new Error('Failed to create workflow');
    }

    return response.json();
  },

  getAll: async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(api.workflows.getAll, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch workflows');
    }

    const data = await response.json();
    // Handle both {workflows: [...]} and direct array response
    const list = data?.workflows ?? data ?? [];
    return Array.isArray(list) ? list : [];
  },

  update: async (id: string, workflow: WorkflowFormData) => {
    const response = await fetch(api.workflows.update(id), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      },
      body: JSON.stringify(workflow)
    });

    if (!response.ok) {
      throw new Error('Failed to update workflow');
    }

    return response.json();
  },

  delete: async (id: string) => {
    const response = await fetch(api.workflows.delete(id), {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to delete workflow');
    }
  },

  getById: async (id: string) => {
    const response = await fetch(api.workflows.getById(id), {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch workflow');
    }

    return response.json();
  }
};