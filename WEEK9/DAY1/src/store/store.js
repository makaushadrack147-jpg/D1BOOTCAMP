import { createStore } from 'redux'
import { initialState, taskReducer } from './reducer.js'

const STORAGE_KEY = 'little-list-planner'

function loadState() {
  if (typeof window === 'undefined') return initialState

  try {
    const savedState = window.localStorage.getItem(STORAGE_KEY)
    if (!savedState) return initialState

    const parsedState = JSON.parse(savedState)
    if (
      !parsedState ||
      typeof parsedState.tasksByDate !== 'object' ||
      parsedState.tasksByDate === null ||
      Array.isArray(parsedState.tasksByDate)
    ) {
      throw new TypeError('Saved planner data has an invalid format.')
    }

    return { tasksByDate: parsedState.tasksByDate }
  } catch (error) {
    console.error('Unable to load saved planner tasks.', error)
    return initialState
  }
}

const devToolsEnhancer =
  typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION__

export const store = createStore(
  taskReducer,
  loadState(),
  devToolsEnhancer ? devToolsEnhancer() : undefined,
)

if (typeof window !== 'undefined') {
  store.subscribe(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store.getState()))
    } catch (error) {
      console.error('Unable to save planner tasks to local storage.', error)
    }
  })
}
