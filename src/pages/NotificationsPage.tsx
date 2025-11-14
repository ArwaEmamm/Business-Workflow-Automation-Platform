import React, { useEffect, useState } from 'react';
import { List, Avatar, Typography, Button, Select, Empty, Spin, message, Space } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, FileTextOutlined, UserOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../app/store';
import { fetchNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '../features/notifications/notificationsSlice';
import type { Notification } from '../types/notification.types';
import { useNavigate } from 'react-router-dom';

const { Text, Title } = Typography;
const { Option } = Select;

const NotificationsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const userRole = useSelector((state: RootState) => state.auth.user?.role);
  const { notifications, loading, error } = useSelector((state: RootState) => state.notifications);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'created':
        return <FileTextOutlined style={{ color: '#1890ff' }} />;
      case 'approved':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'rejected':
        return <CloseCircleOutlined style={{ color: '#ff4d4f' }} />;
      case 'commented':
        return <UserOutlined style={{ color: '#faad14' }} />;
      case 'assigned':
        return <UserOutlined style={{ color: '#722ed1' }} />;
      default:
        return <FileTextOutlined style={{ color: '#1890ff' }} />;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return date.toLocaleDateString();
  };

  const handleNotificationClick = async (notification: Notification) => {
    try {
      // Mark as read if not already read
      if (!notification.isRead) {
        await dispatch(markNotificationAsRead(notification.id));
      }

      // Navigate to related request if available
      if (notification.meta?.requestId) {
        if (userRole === 'employee') {
          navigate(`/employee/requests/${notification.meta.requestId}`);
        } else if (userRole === 'manager') {
          navigate('/manager/requests');
        } else if (userRole === 'hr_manager') {
          navigate('/hr/requests');
        }
      }
    } catch (error) {
      message.error('Failed to mark notification as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await dispatch(markAllNotificationsAsRead());
      message.success('All notifications marked as read');
    } catch (error) {
      message.error('Failed to mark all notifications as read');
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.isRead;
    if (filter === 'read') return notification.isRead;
    return true;
  });

  if (loading && notifications.length === 0) {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <Text type="danger">Error loading notifications: {error}</Text>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <Title level={2} style={{ margin: 0 }}>Notifications</Title>
        <Space>
          <Select value={filter} onChange={setFilter} style={{ width: 120 }}>
            <Option value="all">All</Option>
            <Option value="unread">Unread</Option>
            <Option value="read">Read</Option>
          </Select>
          <Button onClick={handleMarkAllAsRead} disabled={notifications.filter(n => !n.isRead).length === 0}>
            Mark All as Read
          </Button>
        </Space>
      </div>

      {filteredNotifications.length === 0 ? (
        <Empty
          description={filter === 'all' ? 'No notifications' : `No ${filter} notifications`}
          style={{ marginTop: '50px' }}
        />
      ) : (
        <List
          dataSource={filteredNotifications}
          renderItem={(notification) => (
            <List.Item
              style={{
                padding: '16px',
                cursor: 'pointer',
                backgroundColor: notification.isRead ? 'transparent' : '#f6ffed',
                border: '1px solid #f0f0f0',
                borderRadius: '8px',
                marginBottom: '8px',
              }}
              onClick={() => handleNotificationClick(notification)}
            >
              <List.Item.Meta
                avatar={
                  <Avatar
                    size="large"
                    icon={getNotificationIcon(notification.type)}
                    style={{
                      backgroundColor: notification.isRead ? '#f5f5f5' : '#fff',
                    }}
                  />
                }
                title={
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text
                      strong={!notification.isRead}
                      style={{
                        fontSize: '16px',
                        margin: 0,
                        color: notification.isRead ? '#666' : '#000',
                      }}
                    >
                      {notification.title}
                    </Text>
                    <Text
                      type="secondary"
                      style={{ fontSize: '14px', margin: 0 }}
                    >
                      {formatTimeAgo(notification.createdAt)}
                    </Text>
                  </div>
                }
                description={
                  <Text
                    style={{
                      fontSize: '14px',
                      color: notification.isRead ? '#999' : '#666',
                      display: 'block',
                      marginTop: '8px',
                    }}
                  >
                    {notification.message}
                  </Text>
                }
              />
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

export default NotificationsPage;
