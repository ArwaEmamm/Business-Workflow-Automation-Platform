import { api } from '../api/apiEndpoints';
import type { RequestFormData, RequestFilters, ApproveRequestData } from '../../types/request.types';

export const requestsApi = {
  create: async (request: RequestFormData) => {
    const formData = new FormData();
    formData.append('title', request.title);
    formData.append('description', request.description);
    formData.append('workflowId', request.workflowId);

    if (request.attachments) {
      request.attachments.forEach((file, index) => {
        formData.append(`attachments`, file);
      });
    }

    const response = await fetch(api.requests.create(request.workflowId), {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error('Failed to create request');
    }

    return response.json();
  },

  getAll: async (filters: RequestFilters = {}) => {
    const params = new URLSearchParams();

    if (filters.status) params.append('status', filters.status);
    if (filters.workflowId) params.append('workflowId', filters.workflowId);
    if (filters.createdBy) params.append('createdBy', filters.createdBy);
    if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.append('dateTo', filters.dateTo);
    if (filters.search) params.append('search', filters.search);

    const url = `${api.requests.getAll}?${params.toString()}`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch requests');
    }

    return response.json();
  },

  getById: async (id: string) => {
    const response = await fetch(api.requests.getById(id), {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch request');
    }

    return response.json();
  },

  approve: async (id: string, data: ApproveRequestData) => {
    const response = await fetch(api.requests.approve(id), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error('Failed to approve request');
    }

    return response.json();
  },

  forceApprove: async (id: string) => {
    const response = await fetch(`${api.requests.getById(id)}/force-approve`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to force approve request');
    }

    return response.json();
  },

  forceReject: async (id: string) => {
    const response = await fetch(`${api.requests.getById(id)}/force-reject`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to force reject request');
    }

    return response.json();
  },

  downloadAttachment: async (requestId: string, attachmentId: string) => {
    const response = await fetch(`${api.requests.getById(requestId)}/attachments/${attachmentId}/download`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to download attachment');
    }

    return response.blob();
  }
};
