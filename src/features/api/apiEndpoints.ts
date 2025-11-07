export const api = {
  auth: {
    register: '/api/auth/register',
    login: '/api/auth/login'
  },
  dashboard: '/api/dashboard',
  workflows: {
    create: '/api/workflows',
    getAll: '/api/workflows/list', // Updated to use the new list endpoint
    getById: (id: string) => `/api/workflows/${id}`,
    update: (id: string) => `/api/workflows/${id}`,
    delete: (id: string) => `/api/workflows/${id}`
  },
  requests: {
    getAll: '/api/requests',
    create: (workflowId: string) => `/api/requests/workflow/${workflowId}`,
    getById: (id: string) => `/api/requests/${id}`,
    approve: (requestId: string) => `/api/requests/${requestId}/approve`
  }
};