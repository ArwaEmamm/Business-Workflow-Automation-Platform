import { FaClipboardList, FaUsers, FaStream, FaCog, FaChartBar, FaUserShield } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar: React.FC = () => {
	const location = useLocation();

	const items = [
		{ icon: <FaChartBar />, label: 'Dashboard', path: '/admin' },
		{ icon: <FaStream />, label: 'Workflows', path: '/admin/workflows' },
		{ icon: <FaClipboardList />, label: 'Requests', path: '/admin/requests' },
		{ icon: <FaUsers />, label: 'Users', path: '/admin/users' },
		{ icon: <FaUserShield />, label: 'Roles', path: '/admin/roles' },
		{ icon: <FaCog />, label: 'Settings', path: '/admin/settings' }
	];

	return (
		<aside className="employee-sidebar" aria-label="Admin sidebar">
			<div className="sidebar-header">
				<h3 className="sidebar-brand"><span className="brand-icon">WF</span> <span className="brand-text">Admin</span></h3>
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
};

export default Sidebar;