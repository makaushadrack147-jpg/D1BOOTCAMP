import { useState } from 'react'
import { useSelector } from 'react-redux'
import AddTask from './components/AddTask.jsx'
import DatePicker from './components/DatePicker.jsx'
import TaskList from './components/TaskList.jsx'
import { formatLongDate, toDateKey } from './dateUtils.js'

const EMPTY_TASKS = []

export default function App() {
  const [selectedDate, setSelectedDate] = useState(() => toDateKey(new Date()))
  const tasks = useSelector((state) => state.tasks[selectedDate] ?? EMPTY_TASKS)
  const completedCount = tasks.filter((task) => task.completed).length
  const completion = tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0

  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Daymark home">
          <span className="brand-mark" aria-hidden="true">✳</span>
          <span>daymark<span className="brand-period">.</span></span>
        </a>
        <span className="topbar-note">A little more focused, every day.</span>
      </header>

      <section className="welcome">
        <p className="eyebrow">MAKE SPACE FOR WHAT MATTERS</p>
        <h1>A calmer way to<br /><span>get things done.</span></h1>
        <p className="welcome-copy">Your days, your tasks, all in one thoughtful place.</p>
      </section>

      <div className="planner-layout">
        <aside className="sidebar">
          <DatePicker selectedDate={selectedDate} onSelectDate={setSelectedDate} />
          <section className="progress-card" aria-label="Daily progress">
            <div className="progress-heading">
              <span className="progress-icon" aria-hidden="true">↗</span>
              <span>Your daily rhythm</span>
            </div>
            <div className="progress-numbers">
              <strong>{completion}<span>%</span></strong>
              <span>{completedCount} of {tasks.length} done</span>
            </div>
            <div
              className="progress-track"
              role="progressbar"
              aria-label="Daily task completion"
              aria-valuenow={completion}
              aria-valuemin="0"
              aria-valuemax="100"
            >
              <span style={{ width: `${completion}%` }} />
            </div>
            <p>{tasks.length ? 'Small steps add up.' : 'A new day, full of possibility.'}</p>
          </section>
        </aside>

        <section className="tasks-card" aria-labelledby="tasks-heading">
          <div className="tasks-heading">
            <div>
              <p className="section-kicker">YOUR PLAN FOR</p>
              <h2 id="tasks-heading">{formatLongDate(selectedDate)}</h2>
            </div>
            <span className="day-badge" aria-label={`${tasks.length} ${tasks.length === 1 ? 'task' : 'tasks'}`}>
              {String(tasks.length).padStart(2, '0')}
            </span>
          </div>
          <AddTask date={selectedDate} />
          <TaskList date={selectedDate} />
          <footer className="tasks-footer">One thing at a time. You’ve got this.</footer>
        </section>
      </div>

      <p className="page-note">Progress over perfection <span aria-hidden="true">✦</span></p>
    </main>
  )
}
