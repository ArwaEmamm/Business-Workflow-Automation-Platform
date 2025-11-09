import { Link } from 'react-router-dom';
import EmployeeSidebar from '../components/employee/EmployeeSidebar';
import { FaUserCircle, FaBell } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';

const EmployeeLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useSelector((state: RootState) => state.auth);
  const user = auth?.user;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F5F5F5', display: 'flex', flexDirection: 'row' }}>
      <EmployeeSidebar />
      <div style={{ flex: 1 }}>
        <div style={{ backgroundColor: '#007FFF', color: '#fff', padding: '8px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontWeight: 600 }}>Employee Portal</div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <Link to="/employee/notifications" style={{ color: '#fff' }} aria-label="Notifications">
              <FaBell size={18} />
            </Link>
            <Link to="/employee/profile" style={{ color: '#fff', display: 'flex', alignItems: 'center', gap: 8 }} aria-label="Profile">
              <FaUserCircle size={20} />
              <span style={{ fontSize: 14 }}>{user?.name ?? user?.email ?? 'Profile'}</span>
            </Link>
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
