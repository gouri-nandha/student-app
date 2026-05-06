import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)

  const increment = () => {
    setCount(prev => prev + 1)
  }

  const decrement = () => {
    setCount(prev => (prev > 0 ? prev - 1 : 0))
  }

  return (
    <div className="sma-counter-box">
      <p>Count: {count}</p>

      <button
        className="sma-btn sma-btn-primary"
        onClick={increment}
      >
        Increment
      </button>

      <button
        className="sma-btn sma-btn-secondary"
        onClick={decrement}
        disabled={count === 0}
      >
        Decrement
      </button>
    </div>
  )
}

export default Counter