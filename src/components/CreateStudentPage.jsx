import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import client from '../api/client'
import Header from './Header'

export default function CreateStudentPage() {
  const navigate = useNavigate()
  const [form, setForm]     = useState({ name: '', age: '', email: '', city: '' })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    // [e.target.name] uses the input's name attribute as the key
    // This one handler updates any field: name, age, email, or city
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await client.post('/students', {
        ...form,
        age: Number(form.age),   // age must be a number for FastAPI's schema
      })
      navigate('/students')      // go back to the list after creating

    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create student')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Header />
      <main className="sma-main">
        <div className="sma-form-page">
          <div className="sma-form-page-header">
            <Link to="/students" className="sma-back-link">← Back to Students</Link>
            <h2 className="sma-form-page-title">Add New Student</h2>
          </div>

          {error && <div className="sma-alert sma-alert-error">{error}</div>}

          <form onSubmit={handleSubmit} className="sma-form sma-form-wide">
            <div className="sma-form-group">
              <label className="sma-label">Full Name</label>
              <input
                name="name"
                type="text"
                className="sma-input"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Ravi Kumar"
                required
              />
            </div>
            <div className="sma-form-group">
              <label className="sma-label">Age</label>
              <input
                name="age"
                type="number"
                className="sma-input"
                value={form.age}
                onChange={handleChange}
                placeholder="e.g. 20"
                min="1"
                max="100"
                required
              />
            </div>
            <div className="sma-form-group">
              <label className="sma-label">Email</label>
              <input
                name="email"
                type="email"
                className="sma-input"
                value={form.email}
                onChange={handleChange}
                placeholder="e.g. ravi@example.com"
                required
              />
            </div>
            <div className="sma-form-group">
              <label className="sma-label">City</label>
              <input
                name="city"
                type="text"
                className="sma-input"
                value={form.city}
                onChange={handleChange}
                placeholder="e.g. Kuppam"
                required
              />
            </div>
            <div className="sma-form-actions">
              <Link to="/students" className="sma-btn sma-btn-ghost">
                Cancel
              </Link>
              <button
                type="submit"
                className="sma-btn sma-btn-primary"
                disabled={loading}
              >
                {loading ? 'Adding...' : 'Add Student'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  )
}