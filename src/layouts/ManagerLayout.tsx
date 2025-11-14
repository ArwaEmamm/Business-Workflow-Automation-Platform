import React, { useState, useRef, useEffect } from 'react';
import ManagerSidebar from '../components/manager/ManagerSidebar';
import Avatar from '@mui/material/Avatar';
import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';
import { useNavigate } from 'react-router-dom';

interface Props { children: React.ReactNode }

export default function ManagerLayout({ children }: Props) {
  const auth = useSelector((state: RootState) => state.auth);
  const user = auth?.user;
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('auth_token');
    navigate('/login');
  };

  return (
    <div className="employee-page">
      <ManagerSidebar />

      <main className="employee-main">
        <div className="employee-top">
          <div className="employee-top-inner">
            <div className="employee-brand"><span className="brand-icon">WF</span> <strong>Manager</strong></div>
            <div className="employee-user-section" ref={dropdownRef} style={{ position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }} onClick={() => setOpen(!open)}>
                <div className="welcome-text">Welcome, {user?.name ?? 'Manager'}</div>
                <Avatar sx={{ width: 32, height: 32 }}>{user?.name ? user.name.charAt(0).toUpperCase() : 'M'}</Avatar>
              </div>

              <div style={{ position: 'absolute', right: 0, top: 44, zIndex: 50 }}>
                <div style={{
                  transformOrigin: 'top right',
                  transition: 'all 180ms ease-in-out',
                  transform: open ? 'scaleY(1)' : 'scaleY(0)',
                  background: '#fff',
                  color: '#333',
                  minWidth: 160,
                  borderRadius: 6,
                  boxShadow: '0 6px 18px rgba(0,0,0,0.12)',
                  overflow: 'hidden'
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <button onClick={() => { setOpen(false); navigate('/manager/profile'); }} style={{ padding: '10px 12px', border: 'none', background: 'transparent', textAlign: 'left', cursor: 'pointer' }}>View Profile</button>
                    <button onClick={handleLogout} style={{ padding: '10px 12px', border: 'none', background: 'transparent', textAlign: 'left', cursor: 'pointer' }}>Logout</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="employee-container">
          {children}
        </div>
      </main>
    </div>
  );
}
