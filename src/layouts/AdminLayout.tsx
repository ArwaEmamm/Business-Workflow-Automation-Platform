import React from 'react';
import Sidebar from '../components/Sidebar/Sidebar';
import NotificationIcon from '../components/notifications/NotificationIcon';
import './AdminLayout.css';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-light, #f9fbff)', display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1 }}>
        <div className="admin-navbar">
          <div className="navbar-brand">HR Portal</div>
          <div className="navbar-actions">
            <NotificationIcon />
          </div>
        </div>
        <div style={{ padding: '20px' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
