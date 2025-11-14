import React from 'react';
import { FaClipboardList, FaChartBar, FaUser } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import '../../components/employee/EmployeeSidebar.css';

export default function ManagerSidebar() {
  const location = useLocation();

  const items = [
    { icon: <FaUser />, label: 'Profile', path: '/manager/profile' },
    { icon: <FaChartBar />, label: 'Dashboard', path: '/manager' },
    { icon: <FaClipboardList />, label: 'Requests', path: '/manager/requests' }
  ];

  return (
    <aside className="employee-sidebar" aria-label="Manager sidebar">
      <div className="sidebar-header">
        <h3 className="sidebar-brand"><span className="brand-icon">WF</span> <span className="brand-text">Manager</span></h3>
      </div>

      <nav className="sidebar-nav">
        {items.map((it) => (
          <Link
            key={it.path}
            to={it.path}
            className={`sidebar-item ${location.pathname === it.path ? 'active' : ''}`}
          >
            <span className="sidebar-icon">{it.icon}</span>
            <span className="sidebar-label">{it.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
