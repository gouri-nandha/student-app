import { Link, NavLink, useNavigate } from 'react-router-dom'

export default function Header() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/', { replace: true })
  }

  return (
    <header className="sma-header">
      <div className="sma-header-brand">
        <span className="sma-header-logo">◆</span>
        <Link to="/students" className="sma-header-title-link">
          Student Management System
        </Link>
        <Link to="/ai" className="sma-nav-link">AI Assistant</Link>
        <Link to="/ai/chat" className="sma-nav-link">AI Chat</Link>
      </div>
      <nav className="sma-header-nav">
        <NavLink
          to="/students"
          className={({ isActive }) =>
            isActive ? 'sma-header-nav-item sma-nav-active' : 'sma-header-nav-item'
          }
        >
          Students
        </NavLink>
        <button className="sma-btn-logout" onClick={handleLogout}>
          Sign Out
        </button>
      </nav>
    </header>
  )
}