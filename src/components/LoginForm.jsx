import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import client from '../api/client'

export default function LoginForm() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await client.post('/auth/login', { username, password })
      localStorage.setItem('token', response.data.access_token)
      navigate('/students', { replace: true })
      // replace: true — pressing Back from /students does not return to /login

    } catch (err) {
      if (err.response) {
        setError(err.response.data.detail || 'Login failed')
      } else {
        setError('Cannot reach the server. Is FastAPI running?')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="sma-auth-card">
      <h2 className="sma-auth-title">Welcome Back</h2>
      <p className="sma-auth-subtitle">Sign in to manage students</p>

      {error && <div className="sma-alert sma-alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="sma-form">
        <div className="sma-form-group">
          <label className="sma-label">Username</label>
          <input
            type="text"
            className="sma-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            required
          />
        </div>
        <div className="sma-form-group">
          <label className="sma-label">Password</label>
          <input
            type="password"
            className="sma-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>
        <button
          type="submit"
          className="sma-btn sma-btn-primary sma-btn-full"
          disabled={loading || !username || !password}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <p className="sma-auth-switch">
        No account?{' '}
        <Link to="/register" className="sma-auth-switch-btn">Create one</Link>
      </p>
    </div>
  )
}
