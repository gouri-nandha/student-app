import { useState, useRef, useEffect } from 'react'
import client from '../api/client'

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hello! Ask me anything about Python or web development.' }
  ])
  const [input, setInput]     = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    const text = input.trim()
    if (!text || loading) return

    setMessages((prev) => [...prev, { role: 'user', text }])
    setInput('') 
    setLoading(true)

    try {
      const res = await client.post('/ai/chat', { message: text })
      setMessages((prev) => [...prev, { role: 'ai', text: res.data.reply }])
    } catch (err) {
      const detail = err.response?.data?.detail || 'AI unavailable.'
      setMessages((prev) => [...prev, { role: 'ai', text: `Error: ${detail}` }])
    } finally {
      setLoading(false)
    }
  }

  const resetChat = async () => {
    try {
      await client.delete('/ai/chat/reset')
    } catch {
    }
    setMessages([{ role: 'ai', text: 'Conversation reset. What would you like to know?' }])
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2 className="chat-title">AI Assistant</h2>
        <button className="chat-reset-btn" onClick={resetChat}>Reset</button>
      </div>

      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`chat-bubble chat-bubble--${msg.role}`}>
            <span className="chat-role">{msg.role === 'user' ? 'You' : 'AI'}</span>
            <p className="chat-text">{msg.text}</p>
          </div>
        ))}
        {loading && (
          <div className="chat-bubble chat-bubble--ai">
            <span className="chat-role">AI</span>
            <p className="chat-text chat-thinking">Thinking…</p>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="chat-input-row">
        <textarea
          className="chat-input"
          rows={2}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question… (Enter to send, Shift+Enter for new line)"
          disabled={loading}
        />
        <button
          className="sma-btn chat-send-btn"
          onClick={sendMessage}
          disabled={loading || !input.trim()}
        >
          Send
        </button>
      </div>
    </div>
  )
}