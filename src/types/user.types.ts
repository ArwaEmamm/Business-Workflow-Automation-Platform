export interface User {
  id?: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'employee';
  department?: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserFormData {
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'employee';
  department?: string;
  password?: string;
  isActive: boolean;
}

export interface UserFilters {
  role?: string;
  isActive?: boolean;
  search?: string;
}

export interface UserActivity {
  id: string;
  action: string;
  timestamp: string;
  details?: string;
}

export const defaultUserForm: UserFormData = {
  name: '',
  email: '',
  role: 'employee',
  department: '',
  password: '',
  isActive: true
};
