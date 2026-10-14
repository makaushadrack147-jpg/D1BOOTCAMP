import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { deleteTask, editTask, toggleTask } from '../store/tasksSlice.js'

export default function TaskItem({ date, task, index }) {
  const dispatch = useDispatch()
  const [isEditing, setIsEditing] = useState(false)
  const [text, setText] = useState(task.text)

  function saveEdit(event) {
    event.preventDefault()
    const trimmedText = text.trim()
    if (!trimmedText) return
    dispatch(editTask({ date, id: task.id, text: trimmedText }))
    setIsEditing(false)
  }

  function cancelEdit() {
    setText(task.text)
    setIsEditing(false)
  }

  return (
    <li className={`task-row${task.completed ? ' is-complete' : ''}`}>
      <button
        className="task-check"
        type="button"
        aria-label={task.completed ? `Mark ${task.text} incomplete` : `Complete ${task.text}`}
        aria-pressed={task.completed}
        onClick={() => dispatch(toggleTask({ date, id: task.id }))}
      >
        {task.completed && <span aria-hidden="true">✓</span>}
      </button>

      {isEditing ? (
        <form className="edit-form" onSubmit={saveEdit}>
          <label className="sr-only" htmlFor={`edit-task-${task.id}`}>Edit task</label>
          <input
            id={`edit-task-${task.id}`}
            autoFocus
            maxLength={120}
            value={text}
            onChange={(event) => setText(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Escape') cancelEdit()
            }}
          />
          <button className="text-action save-action" type="submit" disabled={!text.trim()}>Save</button>
          <button className="text-action" type="button" onClick={cancelEdit}>Cancel</button>
        </form>
      ) : (
        <>
          <span className="task-number">{String(index + 1).padStart(2, '0')}</span>
          <span className="task-text">{task.text}</span>
          <button
            className="row-action edit-button"
            type="button"
            aria-label={`Edit ${task.text}`}
            onClick={() => setIsEditing(true)}
          >
            Edit
          </button>
          <button
            className="row-action delete-button"
            type="button"
            aria-label={`Delete ${task.text}`}
            onClick={() => dispatch(deleteTask({ date, id: task.id }))}
          >
            <span aria-hidden="true">×</span>
          </button>
        </>
      )}
    </li>
  )
}
