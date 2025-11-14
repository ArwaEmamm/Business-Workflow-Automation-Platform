import { FaUser, FaPlus, FaClipboardList, FaChartBar, FaStream } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import './EmployeeSidebar.css';

const EmployeeSidebar: React.FC = () => {
	const location = useLocation();

	const items = [
		{ icon: <FaUser />, label: 'Profile', path: '/employee/profile' },
		{ icon: <FaChartBar />, label: 'Dashboard', path: '/employee' },
		{ icon: <FaStream />, label: 'Workflows', path: '/employee/workflows' },
		{ icon: <FaPlus />, label: 'New Request', path: '/employee/create-request' },
		{ icon: <FaClipboardList />, label: 'My Requests', path: '/employee/requests' },
		
	];

	return (
		<aside className="employee-sidebar" aria-label="Employee sidebar">
			<div className="sidebar-header">
				<h3 className="sidebar-brand"><span className="brand-icon">WF</span> <span className="brand-text">Employee</span></h3>
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

export default EmployeeSidebar;
