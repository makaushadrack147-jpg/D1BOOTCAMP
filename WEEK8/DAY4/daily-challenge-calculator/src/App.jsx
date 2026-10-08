import { useState } from 'react'

const operations = {
  add: { label: 'Addition', symbol: '+', calculate: (first, second) => first + second },
  subtract: { label: 'Subtraction', symbol: '−', calculate: (first, second) => first - second },
  multiply: { label: 'Multiplication', symbol: '×', calculate: (first, second) => first * second },
  divide: { label: 'Division', symbol: '÷', calculate: (first, second) => first / second },
}

function App() {
  const [firstNumber, setFirstNumber] = useState('')
  const [secondNumber, setSecondNumber] = useState('')
  const [operation, setOperation] = useState('add')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  function resetCalculation() {
    setResult(null)
    setError('')
  }

  function handleSubmit(event) {
    event.preventDefault()

    const first = Number(firstNumber)
    const second = Number(secondNumber)

    if (operation === 'divide' && second === 0) {
      setResult(null)
      setError('You cannot divide by zero. Enter a different second number.')
      return
    }

    const calculation = operations[operation].calculate(first, second)

    if (!Number.isFinite(calculation)) {
      setResult(null)
      setError('That calculation is outside the range of supported numbers.')
      return
    }

    setError('')
    setResult(calculation)
  }

  const formattedResult = result === null
    ? null
    : result.toLocaleString(undefined, { maximumFractionDigits: 10 })

  return (
    <main className="page">
      <section className="calculator" aria-labelledby="calculator-title">
        <div className="calculator-heading">
          <p className="eyebrow">A LITTLE MATH, MADE SIMPLE</p>
          <h1 id="calculator-title">React Calculator</h1>
          <p className="intro">Enter two numbers and choose what you’d like to do.</p>
        </div>

        <form className="calculator-form" onSubmit={handleSubmit}>
          <div className="number-fields">
            <div className="field">
              <label htmlFor="first-number">First number</label>
              <input
                autoComplete="off"
                id="first-number"
                inputMode="decimal"
                onChange={(event) => {
                  setFirstNumber(event.target.value)
                  resetCalculation()
                }}
                placeholder="e.g. 12"
                required
                step="any"
                type="number"
                value={firstNumber}
              />
            </div>

            <div className="field">
              <label htmlFor="second-number">Second number</label>
              <input
                autoComplete="off"
                id="second-number"
                inputMode="decimal"
                onChange={(event) => {
                  setSecondNumber(event.target.value)
                  resetCalculation()
                }}
                placeholder="e.g. 8"
                required
                step="any"
                type="number"
                value={secondNumber}
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="operation">Operation</label>
            <select
              id="operation"
              onChange={(event) => {
                setOperation(event.target.value)
                resetCalculation()
              }}
              value={operation}
            >
              {Object.entries(operations).map(([value, { label }]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          <button className="calculate-button" type="submit">
            Calculate <span aria-hidden="true">→</span>
          </button>
        </form>

        <div
          aria-live="polite"
          className={`result-panel${error ? ' result-panel-error' : ''}`}
          role={error ? 'alert' : 'status'}
        >
          {error ? (
            <>
              <span className="result-label">Something needs attention</span>
              <p className="error-message">{error}</p>
            </>
          ) : result === null ? (
            <>
              <span className="result-label">YOUR RESULT</span>
              <p className="result-placeholder">Your answer will appear here</p>
            </>
          ) : (
            <>
              <span className="result-label">
                {firstNumber} {operations[operation].symbol} {secondNumber}
              </span>
              <p className="result-value">{formattedResult}</p>
            </>
          )}
        </div>
      </section>
      <p className="page-note">Built with React state and event handlers.</p>
    </main>
  )
}

export default App
