import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import client from '../api/client'

export default function RegisterForm() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [success, setSuccess]   = useState('')
  const [loading, setLoading]   = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      await client.post('/auth/register', { username, password })
      setSuccess('Account created! Redirecting to login...')
      setTimeout(() => navigate('/login'), 1500)

    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="sma-auth-card">
      <h2 className="sma-auth-title">Create Account</h2>
      <p className="sma-auth-subtitle">Register to get started</p>

      {error   && <div className="sma-alert sma-alert-error">{error}</div>}
      {success && <div className="sma-alert sma-alert-success">{success}</div>}

      <form onSubmit={handleSubmit} className="sma-form">
        <div className="sma-form-group">
          <label className="sma-label">Username</label>
          <input
            type="text"
            className="sma-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Choose a username"
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
            placeholder="Choose a password"
            required
          />
        </div>
        <button
          type="submit"
          className="sma-btn sma-btn-primary sma-btn-full"
          disabled={loading || !username || !password}
        >
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>

      <p className="sma-auth-switch">
        Already have an account?{' '}
        <Link to="/login" className="sma-auth-switch-btn">Sign in</Link>
      </p>
    </div>
  )
}