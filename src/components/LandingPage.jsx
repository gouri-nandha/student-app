import { Link } from 'react-router-dom'

export default function LandingPage() {
  return (
    <div className="sma-landing">
      <div className="sma-landing-card">
        <div className="sma-landing-logo">◆</div>
        <h1 className="sma-landing-title">Student Management System</h1>
        <p className="sma-landing-subtitle">
          Keep track of your students with ease.
          Add, view, and manage student records all in one place.
        </p>
        <div className="sma-landing-actions">
          <Link to="/login" className="sma-btn sma-btn-primary sma-btn-lg">
            Sign In
          </Link>
          <Link to="/register" className="sma-btn sma-btn-outline sma-btn-lg">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  )
}