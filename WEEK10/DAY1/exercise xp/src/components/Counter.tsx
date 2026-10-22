import { useState } from 'react'

type CounterAction = 'increment' | 'decrement' | 'reset' | 'none'

export default function Counter() {
  const [count, setCount] = useState<number>(0)
  const [lastAction, setLastAction] = useState<CounterAction>('none')

  function increment() {
    setCount((currentCount) => currentCount + 1)
    setLastAction('increment')
  }

  function decrement() {
    setCount((currentCount) => currentCount - 1)
    setLastAction('decrement')
  }

  function reset() {
    setCount(0)
    setLastAction('reset')
  }

  return (
    <section className="demo-card counter-card" aria-labelledby="counter-heading">
      <div className="card-topline">
        <span className="exercise-number">03</span>
        <span className="type-chip">TYPED STATE</span>
      </div>
      <p className="section-label">A LITTLE STATE GOES A LONG WAY</p>
      <h2 id="counter-heading">The counter</h2>
      <div className={`counter-value${count < 0 ? ' is-negative' : ''}`} aria-live="polite">
        {count}
      </div>
      <div className="counter-controls" aria-label="Counter controls">
        <button className="counter-button secondary" type="button" onClick={decrement} aria-label="Decrement counter">−</button>
        <button className="counter-button reset-button" type="button" onClick={reset}>Reset</button>
        <button className="counter-button primary" type="button" onClick={increment} aria-label="Increment counter">+</button>
      </div>
      <p className="action-note" aria-live="polite">
        {lastAction === 'none' ? 'Ready when you are.' : `Last action: ${lastAction}.`}
      </p>
    </section>
  )
}
