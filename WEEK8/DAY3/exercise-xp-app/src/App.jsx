import { createContext, useContext, useRef, useState } from 'react'

const ThemeContext = createContext(null)
const MAX_CHARACTERS = 200

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light')

  function toggleTheme() {
    setTheme((currentTheme) => (currentTheme === 'light' ? 'dark' : 'light'))
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={`app-shell theme-${theme}`}>
        {children}
      </div>
    </ThemeContext.Provider>
  )
}

function useTheme() {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error('useTheme must be used inside a ThemeProvider')
  }

  return context
}

function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
      aria-pressed={theme === 'dark'}
      className="theme-switch"
      onClick={toggleTheme}
      type="button"
    >
      <span className="switch-track" aria-hidden="true">
        <span className="switch-knob" />
      </span>
      <span>{theme === 'light' ? 'Light' : 'Dark'}</span>
    </button>
  )
}

function CharacterCounter() {
  const inputRef = useRef(null)
  const [characterCount, setCharacterCount] = useState(0)

  function updateCount() {
    if (inputRef.current) {
      setCharacterCount(inputRef.current.value.length)
    }
  }

  return (
    <section className="exercise-panel counter-panel" aria-labelledby="counter-title">
      <div className="panel-heading">
        <p className="exercise-number">EXERCISE 02</p>
        <h2 id="counter-title">Character counter</h2>
      </div>
      <label className="field-label" htmlFor="counter-input">Your text</label>
      <textarea
        aria-describedby="counter-status"
        id="counter-input"
        maxLength={MAX_CHARACTERS}
        onInput={updateCount}
        placeholder="Start typing..."
        ref={inputRef}
        rows={5}
      />
      <div className="counter-footer">
        <progress aria-label="Characters used" max={MAX_CHARACTERS} value={characterCount} />
        <output id="counter-status" aria-live="polite">
          <strong>{characterCount}</strong><span> / {MAX_CHARACTERS}</span>
        </output>
      </div>
    </section>
  )
}

function ThemeExercise() {
  const { theme } = useTheme()

  return (
    <section className="exercise-panel theme-panel" aria-labelledby="theme-title">
      <div className="panel-heading">
        <p className="exercise-number">EXERCISE 01</p>
        <h2 id="theme-title">Theme switcher</h2>
      </div>
      <div className="theme-preview" aria-live="polite">
        <span className="preview-orbit" aria-hidden="true">{theme === 'light' ? 'L' : 'D'}</span>
        <div>
          <p className="preview-label">CURRENT THEME</p>
          <p className="preview-value">{theme === 'light' ? 'Light mode' : 'Dark mode'}</p>
        </div>
      </div>
      <ThemeSwitcher />
    </section>
  )
}

function App() {
  return (
    <ThemeProvider>
      <main className="page-wrap">
        <header className="page-header">
          <div>
            <p className="eyebrow">WEEK 08 / DAY 03</p>
            <h1>React Exercise XP</h1>
          </div>
          <span className="header-mark" aria-hidden="true">02</span>
        </header>
        <div className="exercise-grid">
          <ThemeExercise />
          <CharacterCounter />
        </div>
        <footer className="page-footer">Hooks practice <span>·</span> useContext <span>·</span> useRef</footer>
      </main>
    </ThemeProvider>
  )
}

export default App
