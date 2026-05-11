import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import client from '../api/client'
import StudentCard from './StudentCard'

export default function StudentList() {
  const [students, setStudents] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')

  const fetchStudents = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await client.get('/students')
      setStudents(response.data)
    } catch (err) {
      setError('Failed to load students. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchStudents() }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this student? This cannot be undone.')) return
    try {
      await client.delete(`/students/${id}`)
      fetchStudents()
    } catch (err) {
      alert('Delete failed. Please try again.')
    }
  }

  if (loading) return <div className="sma-status">Loading students...</div>
  if (error)   return (
    <div className="sma-status sma-status-error">
      {error}
      <button className="sma-retry-btn" onClick={fetchStudents}>Retry</button>
    </div>
  )

  return (
    <section className="sma-section">
      <div className="sma-section-header">
        <h2 className="sma-section-title">All Students</h2>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <span className="sma-student-count">{students.length} students</span>
          {/* Link to the create page */}
          <Link to="/students/new" className="sma-btn sma-btn-primary">
            + Add Student
          </Link>
        </div>
      </div>

      {students.length === 0 ? (
        <div className="sma-empty-state">
          No students yet.{' '}
          <Link to="/students/new" className="sma-auth-switch-btn">
            Add the first one.
          </Link>
        </div>
      ) : (
        <div className="sma-student-grid">
          {students.map((student) => (
            <StudentCard
              key={student.id}
              student={student}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </section>
  )
}