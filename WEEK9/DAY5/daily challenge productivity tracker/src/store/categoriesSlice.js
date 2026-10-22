import { createSlice, nanoid } from '@reduxjs/toolkit'

const categoryColors = ['violet', 'green', 'amber', 'blue']

const initialState = {
  categories: [
    { id: 'cat-focus', name: 'Focus work', color: 'violet' },
    { id: 'cat-wellness', name: 'Wellness', color: 'green' },
    { id: 'cat-home', name: 'At home', color: 'amber' },
  ],
}

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    addCategory: {
      reducer(state, action) {
        state.categories.push({
          ...action.payload,
          color: categoryColors[state.categories.length % categoryColors.length],
        })
      },
      prepare(name) {
        return {
          payload: {
            id: nanoid(),
            name,
          },
        }
      },
    },
    editCategory(state, action) {
      const category = state.categories.find(({ id }) => id === action.payload.id)
      if (category) category.name = action.payload.name
    },
    deleteCategory(state, action) {
      state.categories = state.categories.filter(({ id }) => id !== action.payload)
    },
  },
})

export const { addCategory, editCategory, deleteCategory } = categoriesSlice.actions
export default categoriesSlice.reducer
