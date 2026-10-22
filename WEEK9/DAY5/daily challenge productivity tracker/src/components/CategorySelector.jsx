import { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addCategory, deleteCategory, editCategory } from '../store/categoriesSlice.js'
import { selectAllCategories, selectAllTasks } from '../store/selectors.js'

const categoryColors = ['violet', 'green', 'amber', 'blue']

export default function CategorySelector({ selectedCategoryId, onSelect }) {
  const dispatch = useDispatch()
  const categories = useSelector(selectAllCategories)
  const tasks = useSelector(selectAllTasks)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')

  const handleAddCategory = useCallback((event) => {
    event.preventDefault()
    const name = newCategoryName.trim()
    if (!name) return
    dispatch(addCategory(name))
    setNewCategoryName('')
  }, [dispatch, newCategoryName])

  const beginEditing = useCallback((category) => {
    setEditingId(category.id)
    setEditName(category.name)
  }, [])

  const handleEditCategory = useCallback((event, id) => {
    event.preventDefault()
    const name = editName.trim()
    if (!name) return
    dispatch(editCategory({ id, name }))
    setEditingId(null)
  }, [dispatch, editName])

  const handleDeleteCategory = useCallback((category) => {
    const taskCount = tasks.filter((task) => task.categoryId === category.id).length
    const detail = taskCount
      ? ` This will also delete ${taskCount} ${taskCount === 1 ? 'task' : 'tasks'} in this category.`
      : ''
    if (!window.confirm(`Delete "${category.name}"?${detail}`)) return

    dispatch(deleteCategory(category.id))
    if (selectedCategoryId === category.id) onSelect('all')
  }, [dispatch, onSelect, selectedCategoryId, tasks])

  return (
    <section className="category-panel" aria-labelledby="category-heading">
      <div className="panel-heading">
        <div>
          <p className="section-kicker">YOUR WORKSPACES</p>
          <h2 id="category-heading">Categories</h2>
        </div>
        <span className="category-total">{categories.length}</span>
      </div>

      <nav className="category-list" aria-label="Task categories">
        <button
          className={`category-option${selectedCategoryId === 'all' ? ' is-selected' : ''}`}
          type="button"
          aria-pressed={selectedCategoryId === 'all'}
          onClick={() => onSelect('all')}
        >
          <span className="category-symbol all-symbol" aria-hidden="true">▦</span>
          <span>All tasks</span>
          <span className="category-task-count">{tasks.length}</span>
        </button>

        {categories.map((category, index) => {
          const taskCount = tasks.filter((task) => task.categoryId === category.id).length
          const color = category.color || categoryColors[index % categoryColors.length]

          return (
            <div className="category-row" key={category.id}>
              {editingId === category.id ? (
                <form
                  className="category-edit-form"
                  onSubmit={(event) => handleEditCategory(event, category.id)}
                >
                  <input
                    autoFocus
                    aria-label={`Rename ${category.name}`}
                    value={editName}
                    onChange={(event) => setEditName(event.target.value)}
                    maxLength={40}
                    required
                  />
                  <button className="icon-action" type="submit" aria-label="Save category name">✓</button>
                  <button className="icon-action" type="button" aria-label="Cancel rename" onClick={() => setEditingId(null)}>×</button>
                </form>
              ) : (
                <>
                  <button
                    className={`category-option${selectedCategoryId === category.id ? ' is-selected' : ''}`}
                    type="button"
                    aria-pressed={selectedCategoryId === category.id}
                    onClick={() => onSelect(category.id)}
                  >
                    <span className={`category-symbol ${color}`} aria-hidden="true">●</span>
                    <span className="category-name">{category.name}</span>
                    <span className="category-task-count">{taskCount}</span>
                  </button>
                  <div className="category-actions">
                    <button className="icon-action" type="button" aria-label={`Rename ${category.name}`} onClick={() => beginEditing(category)}>✎</button>
                    <button className="icon-action delete-icon" type="button" aria-label={`Delete ${category.name}`} onClick={() => handleDeleteCategory(category)}>×</button>
                  </div>
                </>
              )}
            </div>
          )
        })}
      </nav>

      <form className="new-category-form" onSubmit={handleAddCategory}>
        <label className="sr-only" htmlFor="new-category">New category name</label>
        <input
          id="new-category"
          value={newCategoryName}
          onChange={(event) => setNewCategoryName(event.target.value)}
          placeholder="Create a category"
          maxLength={40}
          required
        />
        <button type="submit" aria-label="Add category" disabled={!newCategoryName.trim()}>+</button>
      </form>
    </section>
  )
}
