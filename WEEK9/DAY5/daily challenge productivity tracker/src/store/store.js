import { configureStore } from '@reduxjs/toolkit'
import categoriesReducer from './categoriesSlice.js'
import tasksReducer from './tasksSlice.js'

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    categories: categoriesReducer,
  },
})
