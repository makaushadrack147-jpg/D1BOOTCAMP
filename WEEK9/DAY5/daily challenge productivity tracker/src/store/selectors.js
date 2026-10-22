import { createSelector } from '@reduxjs/toolkit'

const selectTaskItems = (state) => state.tasks.tasks
const selectCategoryItems = (state) => state.categories.categories
const selectCategoryIdArgument = (_state, categoryId) => categoryId

export const selectTasksByCategory = createSelector(
  [selectTaskItems, selectCategoryIdArgument],
  (tasks, categoryId) =>
    categoryId === 'all'
      ? tasks
      : tasks.filter((task) => task.categoryId === categoryId),
)

export const selectCompletedTasks = createSelector(
  [selectTaskItems],
  (tasks) => tasks.filter((task) => task.completed).length,
)

export const selectCategoryById = createSelector(
  [selectCategoryItems, selectCategoryIdArgument],
  (categories, categoryId) =>
    categories.find((category) => category.id === categoryId),
)

export const selectAllTasks = selectTaskItems
export const selectAllCategories = selectCategoryItems
