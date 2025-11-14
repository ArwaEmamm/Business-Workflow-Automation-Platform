import React, { useEffect, useState } from 'react';
import { BellOutlined } from '@ant-design/icons';
import { Badge, Button, Dropdown, List, Avatar, Typography, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState, AppDispatch } from '../../app/store';
import { fetchNotifications, markNotificationAsRead } from '../../features/notifications/notificationsSlice';
import type { Notification } from '../../types/notification.types';
import NotificationDropdown from './NotificationDropdown';

const { Text } = Typography;

interface NotificationIconProps {
  className?: string;
}

const NotificationIcon: React.FC<NotificationIconProps> = ({ className }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { notifications, unreadCount, loading } = useSelector((state: RootState) => state.notifications);
  const userRole = useSelector((state: RootState) => state.auth.user?.role);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  // Fetch notifications on mount and set up polling
  useEffect(() => {
    dispatch(fetchNotifications());

    // Poll for new notifications every 10 seconds (faster updates)
    const interval = setInterval(() => {
      dispatch(fetchNotifications());
    }, 10000);

    return () => clearInterval(interval);
  }, [dispatch]);

  const handleNotificationClick = async (notification: Notification) => {
    try {
      // Mark as read if not already read
      if (!notification.isRead) {
        // dispatch the thunk and wait for it to resolve so UI updates before navigation
        // use unwrap if you want to throw on failure: await dispatch(markNotificationAsRead(notification.id)).unwrap();
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

      setDropdownVisible(false);
    } catch (error) {
      message.error('Failed to mark notification as read');
    }
  };

  const handleViewAll = () => {
    navigate('/notifications');
    setDropdownVisible(false);
  };

  const recentNotifications = notifications.slice(0, 5);

  const dropdownContent = (
    <NotificationDropdown
      notifications={recentNotifications}
      loading={loading}
      onNotificationClick={handleNotificationClick}
      onViewAll={handleViewAll}
    />
  );

  return (
    <Dropdown
      dropdownRender={() => dropdownContent}
      trigger={['click']}
      open={dropdownVisible}
      onOpenChange={setDropdownVisible}
      placement="bottomRight"
    >
      <Button
        type="text"
        icon={
          <Badge count={unreadCount} size="small">
            <BellOutlined style={{ fontSize: '18px' }} />
          </Badge>
        }
        className={className}
        style={{ height: 'auto', padding: '4px 8px' }}
      />
    </Dropdown>
  );
};

export default NotificationIcon;
