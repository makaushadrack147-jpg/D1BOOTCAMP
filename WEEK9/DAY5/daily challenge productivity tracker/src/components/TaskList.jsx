import { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addTask, deleteTask, editTask, updateTaskProgress } from '../store/tasksSlice.js'
import { selectCategoryById, selectTasksByCategory } from '../store/selectors.js'

function TaskRow({ task, onToggle, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(task.title)

  const handleSubmit = useCallback((event) => {
    event.preventDefault()
    const nextTitle = title.trim()
    if (!nextTitle) return
    onEdit(task.id, nextTitle)
    setIsEditing(false)
  }, [onEdit, task.id, title])

  function cancelEditing() {
    setTitle(task.title)
    setIsEditing(false)
  }

  return (
    <li className={`task-row${task.completed ? ' is-complete' : ''}`}>
      {isEditing ? (
        <form className="task-edit-form" onSubmit={handleSubmit}>
          <input
            autoFocus
            aria-label={`Edit ${task.title}`}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            maxLength={120}
            required
          />
          <button className="save-button" type="submit" disabled={!title.trim()}>Save</button>
          <button className="cancel-button" type="button" onClick={cancelEditing}>Cancel</button>
        </form>
      ) : (
        <>
          <button
            className="task-check"
            type="button"
            aria-label={task.completed ? `Mark ${task.title} incomplete` : `Complete ${task.title}`}
            aria-pressed={task.completed}
            onClick={() => onToggle(task)}
          >
            {task.completed && <span aria-hidden="true">✓</span>}
          </button>
          <span className="task-title">{task.title}</span>
          <div className="task-actions">
            <button className="text-action" type="button" onClick={() => setIsEditing(true)}>Edit</button>
            <button className="delete-action" type="button" aria-label={`Delete ${task.title}`} onClick={() => onDelete(task.id)}>×</button>
          </div>
        </>
      )}
    </li>
  )
}

export default function TaskList({ selectedCategoryId }) {
  const dispatch = useDispatch()
  const tasks = useSelector((state) => selectTasksByCategory(state, selectedCategoryId))
  const category = useSelector((state) => selectCategoryById(state, selectedCategoryId))
  const categories = useSelector((state) => state.categories.categories)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskCategory, setNewTaskCategory] = useState(
    selectedCategoryId === 'all' ? categories[0]?.id ?? '' : selectedCategoryId,
  )

  const handleAddTask = useCallback((event) => {
    event.preventDefault()
    const title = newTaskTitle.trim()
    const categoryId = selectedCategoryId === 'all'
      ? (categories.find((category) => category.id === newTaskCategory)?.id ?? '')
      : (categories.find((category) => category.id === selectedCategoryId)?.id ?? '')
    if (!title || !categoryId) return
    dispatch(addTask({ title, categoryId }))
    setNewTaskTitle('')
  }, [categories, dispatch, newTaskCategory, newTaskTitle, selectedCategoryId])

  const handleToggleTask = useCallback((task) => {
    dispatch(updateTaskProgress({ id: task.id, completed: !task.completed }))
  }, [dispatch])

  const handleEditTask = useCallback((id, title) => {
    dispatch(editTask({ id, title }))
  }, [dispatch])

  const handleDeleteTask = useCallback((id) => {
    dispatch(deleteTask(id))
  }, [dispatch])

  const categoryName = category?.name ?? 'All categories'
  const canAddTask = selectedCategoryId === 'all'
    ? categories.some((item) => item.id === newTaskCategory)
    : Boolean(category)

  return (
    <section className="task-panel" aria-labelledby="tasks-heading">
      <div className="task-panel-heading">
        <div>
          <p className="section-kicker">YOUR DAILY PLAN</p>
          <h2 id="tasks-heading">{categoryName}</h2>
        </div>
        <span className="task-total">{tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}</span>
      </div>

      <form className="add-task-form" onSubmit={handleAddTask}>
        <label className="sr-only" htmlFor="new-task">Add a task</label>
        <span className="add-task-icon" aria-hidden="true">+</span>
        <input
          id="new-task"
          value={newTaskTitle}
          onChange={(event) => setNewTaskTitle(event.target.value)}
          placeholder="What would you like to get done?"
          maxLength={120}
          required
        />
        {selectedCategoryId === 'all' && categories.length > 0 && (
          <>
            <label className="sr-only" htmlFor="task-category">Task category</label>
            <select
              id="task-category"
              value={newTaskCategory}
              onChange={(event) => setNewTaskCategory(event.target.value)}
            >
              {categories.map((item) => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </select>
          </>
        )}
        <button className="add-task-button" type="submit" disabled={!newTaskTitle.trim() || !canAddTask}>
          Add task
        </button>
      </form>

      {tasks.length > 0 ? (
        <ul className="task-list">
          {tasks.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              onToggle={handleToggleTask}
              onDelete={handleDeleteTask}
              onEdit={handleEditTask}
            />
          ))}
        </ul>
      ) : (
        <div className="empty-state">
          <span aria-hidden="true">✳</span>
          <h3>{categories.length ? 'A little room for a new win' : 'Create your first category'}</h3>
          <p>{categories.length ? 'Add a task above and make today count.' : 'Add a category to start organizing your tasks.'}</p>
        </div>
      )}

      <footer className="task-panel-footer">
        <span><i className="footer-dot" /> Small steps add up</span>
        <span>Showing {categoryName.toLowerCase()}</span>
      </footer>
    </section>
  )
}
