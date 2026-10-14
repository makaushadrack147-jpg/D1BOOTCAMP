import { useSelector } from 'react-redux'
import TaskItem from './TaskItem.jsx'

const EMPTY_TASKS = []

export default function TaskList({ date }) {
  const tasks = useSelector((state) => state.tasks[date] ?? EMPTY_TASKS)
  const completedCount = tasks.filter((task) => task.completed).length

  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-illustration" aria-hidden="true">✳</span>
        <h3>A fresh page</h3>
        <p>Add a task above and make today your own.</p>
      </div>
    )
  }

  return (
    <>
      <div className="list-summary" aria-live="polite">
        <span>{tasks.length - completedCount} left to do</span>
        <span>{completedCount} of {tasks.length} complete</span>
      </div>
      <ul className="task-list">
        {tasks.map((task, index) => (
          <TaskItem key={task.id} date={date} task={task} index={index} />
        ))}
      </ul>
    </>
  )
}
