import React from 'react';
import { List, Avatar, Typography, Button, Empty, Spin } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, FileTextOutlined, UserOutlined } from '@ant-design/icons';
import type { Notification } from '../../types/notification.types';

const { Text } = Typography;

interface NotificationDropdownProps {
  notifications: Notification[];
  loading: boolean;
  onNotificationClick: (notification: Notification) => void;
  onViewAll: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  notifications,
  loading,
  onNotificationClick,
  onViewAll,
}) => {
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
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', width: '300px' }}>
        <Spin size="small" />
      </div>
    );
  }

  return (
    <div style={{ width: '350px', maxHeight: '400px', overflow: 'hidden' }}>
      <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0' }}>
        <Text strong>Notifications</Text>
      </div>

      {notifications.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="No notifications"
          style={{ padding: '20px' }}
        />
      ) : (
        <List
          dataSource={notifications}
          renderItem={(notification) => (
            <List.Item
              style={{
                padding: '12px 16px',
                cursor: 'pointer',
                backgroundColor: notification.isRead ? 'transparent' : '#f6ffed',
                borderBottom: '1px solid #f0f0f0',
              }}
              onClick={() => onNotificationClick(notification)}
            >
              <List.Item.Meta
                avatar={
                  <Avatar
                    size="small"
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
                        fontSize: '14px',
                        margin: 0,
                        color: notification.isRead ? '#666' : '#000',
                      }}
                    >
                      {notification.title}
                    </Text>
                    <Text
                      type="secondary"
                      style={{ fontSize: '12px', margin: 0 }}
                    >
                      {formatTimeAgo(notification.createdAt)}
                    </Text>
                  </div>
                }
                description={
                  <Text
                    style={{
                      fontSize: '13px',
                      color: notification.isRead ? '#999' : '#666',
                      display: 'block',
                      marginTop: '4px',
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

      <div style={{ padding: '12px 16px', borderTop: '1px solid #f0f0f0' }}>
        <Button type="link" onClick={onViewAll} style={{ padding: 0 }}>
          View All Notifications
        </Button>
      </div>
    </div>
  );
};

export default NotificationDropdown;
