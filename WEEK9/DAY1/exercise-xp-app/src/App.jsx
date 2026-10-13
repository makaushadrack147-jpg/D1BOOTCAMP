import { useState } from 'react'
import { connect } from 'react-redux'
import { addTask, deleteTask, editTask, toggleTask } from './store/actions.js'

const XP_PER_TASK = 10

function TaskBoard({ tasks, addTask, editTask, deleteTask, toggleTask }) {
  const [newTitle, setNewTitle] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const completedCount = tasks.filter((task) => task.completed).length
  const earnedXp = completedCount * XP_PER_TASK
  const remainingCount = tasks.length - completedCount
  const progress = tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0

  function handleAdd(event) {
    event.preventDefault()
    const title = newTitle.trim()
    if (!title) return
    addTask(title)
    setNewTitle('')
  }

  function startEditing(task) {
    setEditingId(task.id)
    setEditTitle(task.title)
  }

  function handleEdit(event, id) {
    event.preventDefault()
    const title = editTitle.trim()
    if (!title) return
    editTask(id, title)
    setEditingId(null)
  }

  return (
    <main className="page">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Exercise XP home">
          <span className="brand-mark" aria-hidden="true">✳</span>
          <span>exercise<span className="brand-light">xp</span></span>
        </a>
        <span className="topbar-label">WEEK 09 <i>/</i> DAY 01</span>
      </header>

      <section className="welcome">
        <div>
          <p className="eyebrow">YOUR NEXT LEVEL STARTS HERE</p>
          <h1>Small wins.<br /><span>Real progress.</span></h1>
          <p className="welcome-copy">Turn the things you need to do into momentum you can feel.</p>
        </div>
        <div className="xp-card" aria-label={`${earnedXp} experience points earned`}>
          <span className="xp-star" aria-hidden="true">✳</span>
          <div>
            <span className="xp-label">TOTAL XP</span>
            <strong>{earnedXp}<small> XP</small></strong>
          </div>
          <span className="xp-spark" aria-hidden="true">✦</span>
        </div>
      </section>

      <section className="progress-card" aria-label="Today's progress">
        <div className="progress-top">
          <div>
            <p className="section-label">TODAY'S PROGRESS</p>
            <h2>{completedCount} <span>/ {tasks.length} tasks complete</span></h2>
          </div>
          <span className="progress-percent">{progress}%</span>
        </div>
        <div
          className="progress-track"
          role="progressbar"
          aria-label="Tasks completed"
          aria-valuenow={completedCount}
          aria-valuemin={0}
          aria-valuemax={tasks.length || 1}
        >
          <span style={{ width: `${progress}%` }} />
        </div>
      </section>

      <section className="board" aria-labelledby="tasks-heading">
        <div className="board-heading">
          <div>
            <p className="section-label">THE ACTION LIST</p>
            <h2 id="tasks-heading">Today's quests</h2>
          </div>
          <span className="remaining-pill">
            {remainingCount} {remainingCount === 1 ? 'to go' : 'to go'}
          </span>
        </div>

        <form className="add-form" onSubmit={handleAdd}>
          <label className="sr-only" htmlFor="new-task">New task</label>
          <span className="add-symbol" aria-hidden="true">+</span>
          <input
            id="new-task"
            value={newTitle}
            onChange={(event) => setNewTitle(event.target.value)}
            placeholder="Add a small win to your list..."
            maxLength={120}
            required
          />
          <button className="add-button" type="submit" disabled={!newTitle.trim()}>
            Add quest
          </button>
        </form>

        {tasks.length > 0 ? (
          <ul className="task-list">
            {tasks.map((task) => (
              <li className={`task-row${task.completed ? ' is-complete' : ''}`} key={task.id}>
                {editingId === task.id ? (
                  <form className="edit-form" onSubmit={(event) => handleEdit(event, task.id)}>
                    <input
                      autoFocus
                      aria-label="Edit quest"
                      value={editTitle}
                      onChange={(event) => setEditTitle(event.target.value)}
                      maxLength={120}
                      required
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
                      className="check-button"
                      type="button"
                      aria-label={task.completed ? `Mark ${task.title} incomplete` : `Complete ${task.title}`}
                      aria-pressed={task.completed}
                      onClick={() => toggleTask(task.id)}
                    >
                      {task.completed && <span aria-hidden="true">✓</span>}
                    </button>
                    <span className="task-title">{task.title}</span>
                    {task.completed && <span className="earned-tag">+{XP_PER_TASK} XP</span>}
                    <div className="task-actions">
                      <button
                        className="text-action"
                        type="button"
                        aria-label={`Edit ${task.title}`}
                        onClick={() => startEditing(task)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-action"
                        type="button"
                        aria-label={`Delete ${task.title}`}
                        onClick={() => deleteTask(task.id)}
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
            <span aria-hidden="true">✳</span>
            <h3>Your first win is waiting</h3>
            <p>Add one small task above. Complete it to earn your first 10 XP.</p>
          </div>
        )}

        <footer className="board-footer">
          <span><i className="footer-dot" /> Every quest is worth {XP_PER_TASK} XP</span>
          <span>{tasks.length} {tasks.length === 1 ? 'quest' : 'quests'} total</span>
        </footer>
      </section>

      <p className="page-note">Progress over perfection <span aria-hidden="true">✦</span></p>
    </main>
  )
}

const ConnectedTaskBoard = connect(
  (state) => ({ tasks: state.tasks }),
  { addTask, editTask, deleteTask, toggleTask },
)(TaskBoard)

export default function App() {
  return <ConnectedTaskBoard />
}
