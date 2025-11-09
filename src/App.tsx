import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import './App.css'
import RegisterPage from './pages/Register'
import LoginPage from './pages/Login'
import LandingPage from './pages/LandingPage'
import AdminDashboard from './pages/admin/AdminDashboard'
import ManagerDashboard from './pages/manager/ManagerDashboard'
import EmployeeDashboard from './pages/employee/EmployeeDashboard'
import CreateRequestPage from './pages/employee/CreateRequestPage'
import EmployeeRequestDetail from './pages/employee/EmployeeRequestDetail'
import EmployeeProfile from './pages/employee/Profile'
import EmployeeRequests from './pages/employee/EmployeeRequests'
import { getRouteByRole } from './utils/auth'
import type { RootState } from './app/store'
import AdminLayout from './layouts/AdminLayout'
import EmployeeLayout from './layouts/EmployeeLayout'
import AuthLayout from './layouts/AuthLayout'
import WorkflowsList from './pages/admin/WorkflowsList'
import UsersList from './pages/admin/UsersList'
import RolesList from './pages/admin/RolesList'
import { CreateWorkflowPage } from './pages/CreateWorkflowPage'
import { EditWorkflowPage } from './pages/EditWorkflowPage'
// WorkflowDetail is a modal component; do not import it directly as a route page
import RequestsList from './pages/admin/RequestsList'
// RequestDetail is used as a component in admin pages; not imported here

// Protected Route Component
const ProtectedRoute = ({ element: Element, allowedRoles }: { element: React.ComponentType, allowedRoles: string[] }) => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth)

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  // If authenticated but user details are not yet loaded, show nothing (avoid redirect to home)
  if (isAuthenticated && !user) {
    // you could return a loader here instead
    return <div />
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />
  }

  return <Element />
}



function App() {
  const auth = useSelector((state: RootState) => state.auth)
  const isAuthenticated = auth ? (auth as { isAuthenticated: boolean }).isAuthenticated : false

  return (
    <BrowserRouter>
      <div className="app-wrapper">
        {isAuthenticated && (
          <nav className="main-nav">
            <div className="nav-brand">
              <Link to={getRouteByRole((auth.user as any)?.role ?? '')}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Workflow
              </Link>
            </div>
          </nav>
        )}
        <main>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/register" element={
              <AuthLayout>
                <RegisterPage />
              </AuthLayout>
            } />
            <Route path="/login" element={
              <AuthLayout>
                <LoginPage />
              </AuthLayout>
            } />
            
            {/* Admin Routes */}
            <Route
              path="/admin"
              element={<ProtectedRoute element={() => (
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              )} allowedRoles={['admin']} />}
            />
            {/* Admin Workflows management */}
            <Route
              path="/admin/workflows"
              element={<ProtectedRoute element={() => (
                <AdminLayout>
                  <WorkflowsList />
                </AdminLayout>
              )} allowedRoles={["admin"]} />}
            />
            <Route
              path="/admin/users"
              element={<ProtectedRoute element={() => (
                <AdminLayout>
                  <UsersList />
                </AdminLayout>
              )} allowedRoles={["admin"]} />}
            />
            <Route
              path="/admin/roles"
              element={<ProtectedRoute element={() => (
                <AdminLayout>
                  <RolesList />
                </AdminLayout>
              )} allowedRoles={["admin"]} />}
            />
            <Route
              path="/admin/requests"
              element={<ProtectedRoute element={() => (
                <AdminLayout>
                  <RequestsList />
                </AdminLayout>
              )} allowedRoles={["admin"]} />}
            />
            <Route
              path="/admin/workflows/create"
              element={<ProtectedRoute element={() => (
                <AdminLayout>
                  <CreateWorkflowPage />
                </AdminLayout>
              )} allowedRoles={["admin"]} />}
            />
            <Route
              path="/admin/workflows/:id"
              element={<ProtectedRoute element={() => (
                <AdminLayout>
                  {/* render workflows list for now; specific workflow detail is shown via modal in list */}
                  <WorkflowsList />
                </AdminLayout>
              )} allowedRoles={["admin"]} />}
            />
            <Route
              path="/admin/workflows/edit/:id"
              element={<ProtectedRoute element={() => (
                <AdminLayout>
                  <EditWorkflowPage />
                </AdminLayout>
              )} allowedRoles={["admin"]} />}
            />

            {/* Manager Routes */}
            <Route
              path="/manager"
              element={<ProtectedRoute element={ManagerDashboard} allowedRoles={['manager']} />}
            />

            {/* Employee Routes */}
            <Route
              path="/employee"
              element={<ProtectedRoute element={() => (
                <EmployeeLayout>
                  <EmployeeDashboard />
                </EmployeeLayout>
              )} allowedRoles={['employee']} />}
            />
            <Route
              path="/employee/create-request"
              element={<ProtectedRoute element={() => (
                <EmployeeLayout>
                  <CreateRequestPage />
                </EmployeeLayout>
              )} allowedRoles={['employee']} />}
            />
            <Route
              path="/employee/profile"
              element={<ProtectedRoute element={() => (
                <EmployeeLayout>
                  <EmployeeProfile />
                </EmployeeLayout>
              )} allowedRoles={['employee']} />}
            />
            <Route
              path="/employee/requests"
              element={<ProtectedRoute element={() => (
                <EmployeeLayout>
                  <EmployeeRequests />
                </EmployeeLayout>
              )} allowedRoles={['employee']} />}
            />
            <Route
              path="/employee/requests/:requestId"
              element={<ProtectedRoute element={() => (
                <EmployeeLayout>
                  <EmployeeRequestDetail />
                </EmployeeLayout>
              )} allowedRoles={['employee']} />}
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App