// src/components/AiChatPage.jsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import client from '../api/client'
import Header from './Header'

export default function AiChatPage() {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer]     = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  async function handleAsk(e) {
    e.preventDefault()
    if (!question.trim()) return

    setLoading(true)
    setError('')
    setAnswer('')
    try {
      // client already adds Authorization: Bearer <token> via interceptor
      const res = await client.post('/ai/ask', { question })
      setAnswer(res.data.answer)
    } catch (err) {
      setError(err.response?.data?.detail || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Header />
      <main className="sma-main">
        <div className="ai-page">
          <div className="ai-page-header">
            <Link to="/students" className="sma-back-link">← Back to Students</Link>
            <h2 className="ai-page-title">AI Study Assistant</h2>
            <p className="ai-page-subtitle">
              Ask any question about Python or full stack development — powered by Google Gemini
            </p>
          </div>

          <form onSubmit={handleAsk} className="sma-form sma-form-wide">
            <div className="sma-form-group">
              <label className="sma-label">Your Question</label>
              <textarea
                className="ai-textarea"
                placeholder="e.g. What is the difference between a list and a tuple?"
                value={question}
                onChange={e => setQuestion(e.target.value)}
                rows={4}
                maxLength={1000}
              />
              <div className="ai-char-count">{question.length} / 1000</div>
            </div>

            <div className="sma-form-actions">
              <button
                type="submit"
                className="sma-btn sma-btn-primary"
                disabled={loading || !question.trim()}
              >
                {loading ? 'Thinking...' : 'Ask Gemini'}
              </button>
            </div>
          </form>

          {error && (
            <div className="sma-alert sma-alert-error">{error}</div>
          )}

          {answer && (
            <div className="ai-answer-box">
              <div className="ai-answer-label">Gemini says</div>
              <div className="ai-answer-text">{answer}</div>
            </div>
          )}
        </div>
      </main>
    </>
  )
}