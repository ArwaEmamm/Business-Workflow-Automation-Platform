import React from 'react';
import Sidebar from '../components/Sidebar/Sidebar';
import { FaBell } from 'react-icons/fa';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-light, #f9fbff)', display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1 }}>
        <div style={{ backgroundColor: '#0d6efd', color: '#fff', padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontWeight: 600 }}>HR Portal</div>
          <div>
            <a href="/hr/notifications" style={{ color: '#fff' }} aria-label="HR Notifications"><FaBell /></a>
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
