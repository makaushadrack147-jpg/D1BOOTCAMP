import { useState } from 'react'

const quotes = [
  { text: 'The future depends on what you do today.', author: 'Mahatma Gandhi' },
  { text: 'Success is the sum of small efforts, repeated day in and day out.', author: 'Robert Collier' },
  { text: 'It always seems impossible until it is done.', author: 'Nelson Mandela' },
  { text: 'Dream big and dare to fail.', author: 'Norman Vaughan' },
  { text: 'Believe you can and you’re halfway there.', author: 'Theodore Roosevelt' },
  { text: 'In the middle of every difficulty lies opportunity.', author: 'Albert Einstein' },
  { text: 'Quality is not an act, it is a habit.', author: 'Aristotle' },
  { text: 'The only limit to our realization of tomorrow is our doubts of today.', author: 'Franklin D. Roosevelt' },
  { text: 'Don’t watch the clock; do what it does. Keep going.', author: 'Sam Levenson' },
  { text: 'You do not find the happy life. You make it.', author: 'Camilla E. Cabello' },
]

const colorThemes = [
  { background: '#fdf2d7', text: '#7a3b2e', button: '#d97706' },
  { background: '#e0f2fe', text: '#0f4c81', button: '#0284c7' },
  { background: '#dcfce7', text: '#166534', button: '#16a34a' },
  { background: '#f3e8ff', text: '#6b21a8', button: '#8b5cf6' },
  { background: '#ffe4e6', text: '#9f1239', button: '#e11d48' },
  { background: '#ecfeff', text: '#0f766e', button: '#14b8a6' },
]

function getRandomQuote(currentIndex) {
  let nextIndex = Math.floor(Math.random() * quotes.length)

  while (nextIndex === currentIndex && quotes.length > 1) {
    nextIndex = Math.floor(Math.random() * quotes.length)
  }

  return nextIndex
}

function App() {
  const [quoteIndex, setQuoteIndex] = useState(0)
  const [themeIndex, setThemeIndex] = useState(0)

  const currentQuote = quotes[quoteIndex]
  const currentTheme = colorThemes[themeIndex]

  function handleNewQuote() {
    setQuoteIndex((prevIndex) => getRandomQuote(prevIndex))
    setThemeIndex((prevIndex) => (prevIndex + 1) % colorThemes.length)
  }

  return (
    <main
      className="app"
      style={{
        backgroundColor: currentTheme.background,
      }}
    >
      <div className="quote-box">
        <h1
          className="quote-text"
          style={{ color: currentTheme.text }}
        >
          “{currentQuote.text}”
        </h1>
        <p
          className="quote-author"
          style={{ color: currentTheme.text }}
        >
          — {currentQuote.author}
        </p>

        <button
          className="quote-button"
          onClick={handleNewQuote}
          style={{
            backgroundColor: currentTheme.button,
            color: '#fff',
          }}
          type="button"
        >
          New Quote
        </button>
      </div>
    </main>
  )
}

export default App
