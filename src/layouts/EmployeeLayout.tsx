import { Link, useNavigate } from 'react-router-dom';
import EmployeeSidebar from '../components/employee/EmployeeSidebar';
import { FaUserCircle, FaBell } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';
import { useState, useRef, useEffect } from 'react';

const EmployeeLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
    // remove both possible token keys
    localStorage.removeItem('token');
    localStorage.removeItem('auth_token');
    navigate('/login');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F5F5F5', display: 'flex', flexDirection: 'row' }}>
      <EmployeeSidebar />
      <div style={{ flex: 1 }}>
        <div style={{ backgroundColor: '#007FFF', color: '#fff', padding: '8px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontWeight: 600 }}>Employee Portal</div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', position: 'relative' }} ref={dropdownRef}>
            <Link to="/employee/notifications" style={{ color: '#fff' }} aria-label="Notifications">
              <FaBell size={18} />
            </Link>

            <div style={{ color: '#fff', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }} onClick={() => setOpen(!open)} aria-label="Profile menu">
              <FaUserCircle size={20} />
              <span style={{ fontSize: 14 }}>{user?.name ?? user?.email ?? 'Profile'}</span>
            </div>

            {/* Dropdown */}
            <div style={{ position: 'absolute', right: 8, top: '48px', zIndex: 50 }}>
              <div style={{
                transformOrigin: 'top right',
                transition: 'all 180ms ease-in-out',
                transform: open ? 'scaleY(1)' : 'scaleY(0)',
                transformBox: 'fill-box',
                transformStyle: 'preserve-3d',
                background: '#fff',
                color: '#333',
                minWidth: 160,
                borderRadius: 6,
                boxShadow: '0 6px 18px rgba(0,0,0,0.12)',
                overflow: 'hidden'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <button onClick={() => { setOpen(false); navigate('/employee/profile'); }} style={{ padding: '10px 12px', border: 'none', background: 'transparent', textAlign: 'left', cursor: 'pointer' }}>View Profile</button>
                  <button onClick={handleLogout} style={{ padding: '10px 12px', border: 'none', background: 'transparent', textAlign: 'left', cursor: 'pointer' }}>Logout</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style={{ padding: '20px' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default EmployeeLayout;
