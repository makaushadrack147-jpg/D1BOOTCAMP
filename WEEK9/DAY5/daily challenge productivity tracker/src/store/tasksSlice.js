import { createSlice, nanoid } from '@reduxjs/toolkit'
import { deleteCategory } from './categoriesSlice.js'

const initialState = {
  tasks: [
    { id: 'task-plan', title: 'Plan the week’s priorities', categoryId: 'cat-focus', completed: true },
    { id: 'task-report', title: 'Finish the project outline', categoryId: 'cat-focus', completed: false },
    { id: 'task-walk', title: 'Take a walk outside', categoryId: 'cat-wellness', completed: false },
    { id: 'task-water', title: 'Refill the water bottle', categoryId: 'cat-wellness', completed: true },
    { id: 'task-meal', title: 'Prep lunch for tomorrow', categoryId: 'cat-home', completed: false },
  ],
}

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: {
      reducer(state, action) {
        state.tasks.unshift(action.payload)
      },
      prepare({ title, categoryId }) {
        return {
          payload: {
            id: nanoid(),
            title,
            categoryId,
            completed: false,
          },
        }
      },
    },
    editTask(state, action) {
      const task = state.tasks.find(({ id }) => id === action.payload.id)
      if (task) task.title = action.payload.title
    },
    deleteTask(state, action) {
      state.tasks = state.tasks.filter(({ id }) => id !== action.payload)
    },
    updateTaskProgress(state, action) {
      const task = state.tasks.find(({ id }) => id === action.payload.id)
      if (task) task.completed = action.payload.completed
    },
  },
  extraReducers(builder) {
    builder.addCase(deleteCategory, (state, action) => {
      state.tasks = state.tasks.filter((task) => task.categoryId !== action.payload)
    })
  },
})

export const { addTask, editTask, deleteTask, updateTaskProgress } = tasksSlice.actions
export default tasksSlice.reducer
