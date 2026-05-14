import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import client from '../api/client'
import Header from './Header'

export default function EditStudentPage() {
  const { id } = useParams()   // reads the :id from /students/:id/edit
  const navigate = useNavigate()

  const [form, setForm]       = useState({ name: '', age: '', email: '', city: '' })
  const [fetching, setFetching] = useState(true)   // loading the existing student
  const [saving, setSaving]   = useState(false)    // submitting the form
  const [error, setError]     = useState('')

  // Fetch the existing student data to pre-fill the form
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await client.get(`/students/${id}`)
        const s = response.data
        setForm({
          name:  s.name,
          age:   String(s.age),  // convert to string — input value must be string
          email: s.email,
          city:  s.city,
        })
      } catch (err) {
        setError('Student not found.')
      } finally {
        setFetching(false)
      }
    }
    fetchStudent()
  }, [id])   // re-fetch if the id in the URL changes

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSaving(true)

    try {
      await client.put(`/students/${id}`, {
        ...form,
        age: Number(form.age),
      })
      navigate('/students')

    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update student')
    } finally {
      setSaving(false)
    }
  }

  if (fetching) {
    return (
      <>
        <Header />
        <main className="sma-main">
          <div className="sma-status">Loading student...</div>
        </main>
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="sma-main">
        <div className="sma-form-page">
          <div className="sma-form-page-header">
            <Link to="/students" className="sma-back-link">← Back to Students</Link>
            <h2 className="sma-form-page-title">Edit Student</h2>
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
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  )
}