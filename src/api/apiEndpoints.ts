export const API_BASE_URL = "http://localhost:4000/api";

export const endpoints = {
  auth: {
    register: `${API_BASE_URL}/auth/register`,
    login: `${API_BASE_URL}/auth/login`,
  },
  workflows: {
    getAll: `${API_BASE_URL}/workflows`,
    create: `${API_BASE_URL}/workflows`,
  },
  users: {
    getAll: `${API_BASE_URL}/users`,
    getById: (id: string) => `${API_BASE_URL}/users/${id}`,
    create: `${API_BASE_URL}/users`,
    update: (id: string) => `${API_BASE_URL}/users/${id}`,
    activate: (id: string) => `${API_BASE_URL}/users/${id}/activate`,
    deactivate: (id: string) => `${API_BASE_URL}/users/${id}/deactivate`,
    resetPassword: (id: string) => `${API_BASE_URL}/users/${id}/reset-password`,
    getAllRequests: `${API_BASE_URL}/users/requests`,
  },
  requests: {
    getAll: `${API_BASE_URL}/requests`,
    // create should include workflow id in the path: /api/requests/workflow/:workflowId
    create: (workflowId?: string) => workflowId ? `${API_BASE_URL}/requests/workflow/${workflowId}` : `${API_BASE_URL}/requests`,
    getById: (id: string) => `${API_BASE_URL}/requests/${id}`,
    approve: (id: string) => `${API_BASE_URL}/requests/${id}/approve`,
  },
  dashboard: `${API_BASE_URL}/dashboard`,
  notifications: {
    getAll: `${API_BASE_URL}/notifications`,
    markRead: (id: string) => `${API_BASE_URL}/notifications/${id}/read`,
  },
};