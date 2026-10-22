import { useCallback, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import CategorySelector from './components/CategorySelector.jsx'
import TaskList from './components/TaskList.jsx'
import { selectAllTasks, selectCompletedTasks } from './store/selectors.js'

export default function App() {
  const [selectedCategoryId, setSelectedCategoryId] = useState('all')
  const tasks = useSelector(selectAllTasks)
  const completedCount = useSelector(selectCompletedTasks)
  const completionRate = useMemo(
    () => tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0,
    [completedCount, tasks.length],
  )

  const handleCategorySelect = useCallback((categoryId) => {
    setSelectedCategoryId(categoryId)
  }, [])

  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Daymark home">
          <span className="brand-mark" aria-hidden="true">d.</span>
          <span>day<span className="brand-accent">mark</span></span>
        </a>
        <span className="topbar-note">A clearer day, one task at a time</span>
      </header>

      <section className="welcome">
        <div>
          <p className="eyebrow">YOUR DAILY MOMENTUM</p>
          <h1>Make space for<br /><span>what matters.</span></h1>
          <p className="welcome-copy">A thoughtful plan turns the busy bits into progress you can see.</p>
        </div>
        <div className="date-card">
          <span className="date-spark" aria-hidden="true">✳</span>
          <span className="date-label">TODAY</span>
          <strong>{new Intl.DateTimeFormat('en', { weekday: 'short' }).format(new Date())}</strong>
          <span className="date-day">{new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(new Date())}</span>
        </div>
      </section>

      <section className="progress-card" aria-label="Daily completion progress">
        <div className="progress-top">
          <div>
            <p className="section-kicker">A GOOD START</p>
            <h2>{completedCount} <span>of {tasks.length} tasks complete</span></h2>
          </div>
          <span className="progress-percent">{completionRate}%</span>
        </div>
        <div
          className="progress-track"
          role="progressbar"
          aria-label="Tasks completed"
          aria-valuenow={completedCount}
          aria-valuemin={0}
          aria-valuemax={tasks.length || 1}
        >
          <span style={{ width: `${completionRate}%` }} />
        </div>
      </section>

      <div className="workspace">
        <CategorySelector
          selectedCategoryId={selectedCategoryId}
          onSelect={handleCategorySelect}
        />
        <TaskList selectedCategoryId={selectedCategoryId} />
      </div>

      <footer className="page-footer">
        <span>Progress over perfection <span aria-hidden="true">✦</span></span>
        <span>WEEK 09 <i>/</i> DAY 05</span>
      </footer>
    </main>
  )
}
