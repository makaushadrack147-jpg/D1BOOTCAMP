import { createSlice, nanoid } from '@reduxjs/toolkit'

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: {},
  reducers: {
    addTask: {
      reducer: (state, action) => {
        const { date, task } = action.payload
        state[date] ??= []
        state[date].push(task)
      },
      prepare: ({ date, text }) => ({
        payload: {
          date,
          task: {
            id: nanoid(),
            text,
            completed: false,
          },
        },
      }),
    },
    editTask: (state, action) => {
      const { date, id, text } = action.payload
      const task = state[date]?.find((item) => item.id === id)
      if (task) task.text = text
    },
    deleteTask: (state, action) => {
      const { date, id } = action.payload
      if (state[date]) {
        state[date] = state[date].filter((task) => task.id !== id)
        if (state[date].length === 0) delete state[date]
      }
    },
    toggleTask: (state, action) => {
      const { date, id } = action.payload
      const task = state[date]?.find((item) => item.id === id)
      if (task) task.completed = !task.completed
    },
  },
})

export const { addTask, editTask, deleteTask, toggleTask } = tasksSlice.actions
export default tasksSlice.reducer
