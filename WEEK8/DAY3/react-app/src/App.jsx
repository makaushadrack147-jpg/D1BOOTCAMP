import { createContext, useContext, useEffect, useReducer, useRef, useState } from 'react'

const TaskContext = createContext(null)

const initialState = {
  tasks: [
    { id: 1, text: 'Review project brief', completed: false },
    { id: 2, text: 'Submit task update', completed: true },
  ],
  filter: 'all',
}

function taskReducer(state, action) {
  switch (action.type) {
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] }
    case 'TOGGLE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((task) => (task.id === action.payload.id ? { ...task, completed: !task.completed } : task)),
      }
    case 'REMOVE_TASK':
      return { ...state, tasks: state.tasks.filter((task) => task.id !== action.payload.id) }
    case 'EDIT_TASK':
      return {
        ...state,
        tasks: state.tasks.map((task) => (task.id === action.payload.id ? { ...task, text: action.payload.text } : task)),
      }
    case 'FILTER_TASKS':
      return { ...state, filter: action.payload.filter }
    default:
      return state
  }
}

function TaskProvider({ children }) {
  const [state, dispatch] = useReducer(taskReducer, initialState)

  return <TaskContext.Provider value={{ ...state, dispatch }}>{children}</TaskContext.Provider>
}

function useTasks() {
  const context = useContext(TaskContext)

  if (!context) {
    throw new Error('useTasks must be used inside a TaskProvider')
  }

  return context
}

function TaskForm() {
  const { dispatch } = useTasks()
  const [taskText, setTaskText] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    const text = taskText.trim()

    if (!text) return

    dispatch({
      type: 'ADD_TASK',
      payload: {
        id: crypto.randomUUID(),
        text,
        completed: false,
      },
    })

    setTaskText('')
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <label className="task-label" htmlFor="task-input">Add a task</label>
      <div className="task-input-row">
        <input
          autoComplete="off"
          className="task-input"
          id="task-input"
          onChange={(event) => setTaskText(event.target.value)}
          placeholder="What needs to be done?"
          value={taskText}
        />
        <button className="add-task-button" type="submit">Add</button>
      </div>
    </form>
  )
}

function TaskSummary() {
  const { tasks } = useTasks()
  const remaining = tasks.filter((task) => !task.completed).length

  return (
    <div className="task-summary" aria-live="polite">
      <div>
        <span className="summary-label">Total</span>
        <strong>{tasks.length}</strong>
      </div>
      <div>
        <span className="summary-label">Remaining</span>
        <strong>{remaining}</strong>
      </div>
    </div>
  )
}

function TaskList() {
  const { tasks, filter, dispatch } = useTasks()
  const [editingTaskId, setEditingTaskId] = useState(null)
  const editInputRef = useRef(null)
  const visibleTasks = tasks.filter((task) => {
    if (filter === 'active') return !task.completed
    if (filter === 'completed') return task.completed
    return true
  })

  useEffect(() => {
    if (editingTaskId !== null) editInputRef.current?.focus()
  }, [editingTaskId])

  function saveTask(event, taskId) {
    event.preventDefault()
    const text = editInputRef.current?.value.trim()
    if (!text) return

    dispatch({ type: 'EDIT_TASK', payload: { id: taskId, text } })
    setEditingTaskId(null)
  }

  return (
    <>
      <div className="task-filters" aria-label="Filter tasks" role="group">
        {['all', 'active', 'completed'].map((filterOption) => (
          <button
            aria-pressed={filter === filterOption}
            className={`filter-button ${filter === filterOption ? 'selected' : ''}`}
            key={filterOption}
            onClick={() => dispatch({ type: 'FILTER_TASKS', payload: { filter: filterOption } })}
            type="button"
          >
            {filterOption[0].toUpperCase() + filterOption.slice(1)}
          </button>
        ))}
      </div>
      {tasks.length === 0 ? (
        <p className="empty-state">No tasks yet. Add the first one above.</p>
      ) : visibleTasks.length === 0 ? (
        <p className="empty-state">No {filter} tasks.</p>
      ) : (
        <ul className="task-list">
          {visibleTasks.map((task) => (
            <li className={`task-item ${task.completed ? 'completed' : ''}`} key={task.id}>
              <button
                aria-label={task.completed ? `Mark ${task.text} as incomplete` : `Mark ${task.text} as complete`}
                className="toggle-button"
                onClick={() => dispatch({ type: 'TOGGLE_TASK', payload: { id: task.id } })}
                type="button"
              >
                {task.completed ? '✓' : '○'}
              </button>
              {editingTaskId === task.id ? (
                <form className="edit-form" onSubmit={(event) => saveTask(event, task.id)}>
                  <input
                    aria-label={`Edit ${task.text}`}
                    className="edit-input"
                    defaultValue={task.text}
                    ref={editInputRef}
                  />
                  <button className="save-button" type="submit">Save</button>
                  <button className="cancel-button" onClick={() => setEditingTaskId(null)} type="button">Cancel</button>
                </form>
              ) : (
                <>
                  <span className="task-text">{task.text}</span>
                  <button className="edit-button" onClick={() => setEditingTaskId(task.id)} type="button">
                    Edit
                  </button>
                  <button
                    aria-label={`Remove ${task.text}`}
                    className="delete-button"
                    onClick={() => dispatch({ type: 'REMOVE_TASK', payload: { id: task.id } })}
                    type="button"
                  >
                    Remove
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

function App() {
  return (
    <TaskProvider>
      <main className="task-app">
        <header className="task-header">
          <div>
            <p className="eyebrow">WEEK 08 / DAY 03</p>
            <h1>Task Manager</h1>
          </div>
        </header>

        <section className="task-panel">
          <TaskForm />
          <TaskSummary />
          <TaskList />
        </section>
      </main>
    </TaskProvider>
  )
}

export default App