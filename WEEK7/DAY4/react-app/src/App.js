import LandingPage from './LandingPage.jsx'
import DailyChallenge from './DailyChallenge.jsx'
import ExerciseXP from './ExerciseXP.jsx'
import './App.css'

function App() {
  const view = new URLSearchParams(window.location.search).get('view')

  if (view === 'daily-challenge') {
    return (
      <main className="page-shell">
        <a className="exercise-return-link" href="/">
          Back to Fieldtrip
        </a>
        <DailyChallenge />
      </main>
    )
  }

  if (view === 'exercise-xp') {
    return (
      <main className="page-shell">
        <a className="exercise-return-link" href="/">
          Back to Fieldtrip
        </a>
        <ExerciseXP />
      </main>
    )
  }

  return <LandingPage />
}

export default App
