import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import './App.css'
import RegisterPage from './pages/Register'
import LoginPage from './pages/Login'
import type { RootState } from './app/store'

function Home() {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="workflow-badge">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Workflow Manager
          </div>
          <h1 className="auth-title">Welcome to Workflow</h1>
          <p className="auth-desc">Manage your tasks and workflows efficiently</p>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/register" className="btn btn-primary">
            Get Started
          </Link>
          <Link to="/login" className="btn btn-secondary">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}

function App() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth)

  return (
    <BrowserRouter>
      <div className="app-wrapper">
        <nav className="main-nav">
          <div className="nav-brand">
            <Link to="/">Workflow</Link>
          </div>
          <div className="nav-links">
            {!isAuthenticated ? (
              <>
                <Link to="/login">Login</Link>
                <Link to="/register" className="nav-cta">Sign Up</Link>
              </>
            ) : (
              <Link to="/">Dashboard</Link>
            )}
          </div>
        </nav>
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App