import { useState } from 'react'
import { connect } from 'react-redux'
import { addTask, deleteTask, editTask, toggleTask } from './store/actions.js'

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const longDate = new Intl.DateTimeFormat('en', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  year: 'numeric',
})
const monthDate = new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' })

function dateKey(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function fromDateKey(key) {
  const [year, month, day] = key.split('-').map(Number)
  return new Date(year, month - 1, day)
}

function CalendarView({ selectedDate, onSelectDate, tasksByDate }) {
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const date = fromDateKey(selectedDate)
    return new Date(date.getFullYear(), date.getMonth(), 1)
  })
  const today = dateKey(new Date())
  const firstDay = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1)
  const startOffset = (firstDay.getDay() + 6) % 7
  const daysInMonth = new Date(
    visibleMonth.getFullYear(),
    visibleMonth.getMonth() + 1,
    0,
  ).getDate()
  const days = Array.from({ length: 42 }, (_, index) => {
    const date = new Date(
      visibleMonth.getFullYear(),
      visibleMonth.getMonth(),
      index - startOffset + 1,
    )
    return { date, key: dateKey(date), inMonth: date.getMonth() === visibleMonth.getMonth() }
  })

  function changeMonth(amount) {
    setVisibleMonth((month) => new Date(month.getFullYear(), month.getMonth() + amount, 1))
  }

  function selectDate(key) {
    onSelectDate(key)
    const date = fromDateKey(key)
    setVisibleMonth(new Date(date.getFullYear(), date.getMonth(), 1))
  }

  return (
    <section className="calendar-card" aria-label="Choose a day">
      <div className="calendar-heading">
        <div>
          <p className="section-kicker">YOUR CALENDAR</p>
          <h2>{monthDate.format(visibleMonth)}</h2>
        </div>
        <div className="month-controls">
          <button
            className="icon-button"
            type="button"
            aria-label="Previous month"
            onClick={() => changeMonth(-1)}
          >
            <span aria-hidden="true">‹</span>
          </button>
          <button
            className="icon-button"
            type="button"
            aria-label="Next month"
            onClick={() => changeMonth(1)}
          >
            <span aria-hidden="true">›</span>
          </button>
        </div>
      </div>

      <div className="calendar-grid" role="grid" aria-label={monthDate.format(visibleMonth)}>
        {weekDays.map((day) => (
          <span className="weekday" role="columnheader" key={day}>{day}</span>
        ))}
        {days.map(({ date, key, inMonth }) => {
          const count = tasksByDate[key]?.length ?? 0
          const isSelected = key === selectedDate
          const isToday = key === today
          return (
            <button
              className={[
                'calendar-day',
                inMonth ? '' : 'is-outside',
                isSelected ? 'is-selected' : '',
                isToday ? 'is-today' : '',
              ].filter(Boolean).join(' ')}
              type="button"
              role="gridcell"
              key={key}
              aria-label={`${longDate.format(date)}${count ? `, ${count} ${count === 1 ? 'task' : 'tasks'}` : ''}`}
              aria-pressed={isSelected}
              onClick={() => selectDate(key)}
            >
              <span>{date.getDate()}</span>
              {count > 0 && <i className="task-indicator" aria-hidden="true" />}
            </button>
          )
        })}
      </div>

      <div className="calendar-legend">
        <span><i className="legend-dot today-dot" /> Today</span>
        <span><i className="legend-dot task-dot" /> Has tasks</span>
      </div>
    </section>
  )
}

const Calendar = connect((state) => ({ tasksByDate: state.tasksByDate }))(CalendarView)

function TaskPanel({
  selectedDate,
  tasks,
  addTask,
  editTask,
  deleteTask,
  toggleTask,
}) {
  const [newTitle, setNewTitle] = useState('')
  const [newTime, setNewTime] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editTime, setEditTime] = useState('')
  const completedCount = tasks.filter((task) => task.completed).length
  const activeCount = tasks.length - completedCount

  function submitNewTask(event) {
    event.preventDefault()
    const title = newTitle.trim()
    if (!title) return
    addTask(selectedDate, title, newTime)
    setNewTitle('')
    setNewTime('')
  }

  function beginEditing(task) {
    setEditingId(task.id)
    setEditTitle(task.title)
    setEditTime(task.time)
  }

  function submitEdit(event, id) {
    event.preventDefault()
    const title = editTitle.trim()
    if (!title) return
    editTask(selectedDate, id, { title, time: editTime })
    setEditingId(null)
  }

  return (
    <section className="tasks-card" aria-labelledby="day-heading">
      <div className="tasks-header">
        <div>
          <p className="section-kicker">THE PLAN</p>
          <h2 id="day-heading">{longDate.format(fromDateKey(selectedDate))}</h2>
        </div>
        <span className="task-count">
          {tasks.length === 0 ? 'No tasks' : `${activeCount} left`}
        </span>
      </div>

      <form className="task-form" onSubmit={submitNewTask}>
        <label className="sr-only" htmlFor="new-task-title">Task name</label>
        <input
          id="new-task-title"
          type="text"
          value={newTitle}
          onChange={(event) => setNewTitle(event.target.value)}
          placeholder="What would you like to get done?"
          maxLength={120}
          required
        />
        <label className="sr-only" htmlFor="new-task-time">Task time (optional)</label>
        <input
          id="new-task-time"
          className="time-input"
          type="time"
          value={newTime}
          onChange={(event) => setNewTime(event.target.value)}
          aria-label="Task time (optional)"
        />
        <button className="add-button" type="submit" disabled={!newTitle.trim()}>
          <span aria-hidden="true">+</span> Add task
        </button>
      </form>

      {tasks.length > 0 ? (
        <ul className="task-list">
          {tasks.map((task) => (
            <li className={`task-row${task.completed ? ' is-complete' : ''}`} key={task.id}>
              {editingId === task.id ? (
                <form className="edit-form" onSubmit={(event) => submitEdit(event, task.id)}>
                  <input
                    autoFocus
                    aria-label="Edit task name"
                    value={editTitle}
                    onChange={(event) => setEditTitle(event.target.value)}
                    maxLength={120}
                    required
                  />
                  <input
                    className="time-input"
                    type="time"
                    aria-label="Edit task time (optional)"
                    value={editTime}
                    onChange={(event) => setEditTime(event.target.value)}
                  />
                  <button className="save-button" type="submit" disabled={!editTitle.trim()}>
                    Save
                  </button>
                  <button
                    className="cancel-button"
                    type="button"
                    onClick={() => setEditingId(null)}
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <>
                  <button
                    className="task-check"
                    type="button"
                    aria-label={task.completed ? `Mark ${task.title} incomplete` : `Complete ${task.title}`}
                    aria-pressed={task.completed}
                    onClick={() => toggleTask(selectedDate, task.id)}
                  >
                    {task.completed && <span aria-hidden="true">✓</span>}
                  </button>
                  <div className="task-copy">
                    <span className="task-title">{task.title}</span>
                    {task.time && <span className="task-time">{task.time}</span>}
                  </div>
                  <div className="task-actions">
                    <button
                      className="text-action"
                      type="button"
                      aria-label={`Edit ${task.title}`}
                      onClick={() => beginEditing(task)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-action"
                      type="button"
                      aria-label={`Delete ${task.title}`}
                      onClick={() => deleteTask(selectedDate, task.id)}
                    >
                      <span aria-hidden="true">×</span>
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <div className="empty-state">
          <span className="empty-illustration" aria-hidden="true">✳</span>
          <h3>A little breathing room</h3>
          <p>No plans for this day yet. Add a task above when you’re ready.</p>
        </div>
      )}

      <footer className="tasks-footer">
        <span><i className="footer-spark" aria-hidden="true">✳</i> One thing at a time</span>
        {tasks.length > 0 && (
          <span>{completedCount} of {tasks.length} complete</span>
        )}
      </footer>
    </section>
  )
}

const ConnectedTaskPanel = connect(
  (state, ownProps) => ({
    tasks: state.tasksByDate[ownProps.selectedDate] ?? [],
  }),
  { addTask, editTask, deleteTask, toggleTask },
)(TaskPanel)

export default function App() {
  const [selectedDate, setSelectedDate] = useState(() => dateKey(new Date()))

  function showToday() {
    setSelectedDate(dateKey(new Date()))
  }

  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Little List planner home">
          <span className="brand-mark" aria-hidden="true">l</span>
          <span>little list</span>
        </a>
        <span className="topbar-note">A little more focused, every day.</span>
      </header>

      <section className="welcome">
        <div>
          <p className="eyebrow">MAKE SPACE FOR WHAT MATTERS</p>
          <h1>Your days,<br /><span>beautifully planned.</span></h1>
          <p className="welcome-copy">A calmer way to keep track of all the little things.</p>
        </div>
        <button className="today-button" type="button" onClick={showToday}>
          <span aria-hidden="true">⌖</span> Back to today
        </button>
      </section>

      <div className="planner-layout">
        <Calendar selectedDate={selectedDate} onSelectDate={setSelectedDate} />
        <ConnectedTaskPanel selectedDate={selectedDate} />
      </div>

      <p className="page-note">Made for your next small win <span aria-hidden="true">✳</span></p>
    </main>
  )
}
