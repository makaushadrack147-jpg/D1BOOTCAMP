import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addTask } from '../store/tasksSlice.js'

export default function AddTask({ date }) {
  const [text, setText] = useState('')
  const dispatch = useDispatch()

  function handleSubmit(event) {
    event.preventDefault()
    const trimmedText = text.trim()
    if (!trimmedText) return

    dispatch(addTask({ date, text: trimmedText }))
    setText('')
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <label className="sr-only" htmlFor="new-task">Add a task</label>
      <span className="input-plus" aria-hidden="true">+</span>
      <input
        id="new-task"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="What needs to get done?"
        maxLength={120}
        required
      />
      <button className="add-button" type="submit" disabled={!text.trim()}>
        Add task <span aria-hidden="true">↗</span>
      </button>
    </form>
  )
}
