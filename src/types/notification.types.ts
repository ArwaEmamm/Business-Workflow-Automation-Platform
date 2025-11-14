export interface Notification {
  id: string;
  type: 'created' | 'approved' | 'rejected' | 'commented' | 'assigned';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  meta?: {
    requestId?: string;
    workflowId?: string;
    userId?: string;
  };
}

export interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
}
