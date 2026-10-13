import { createStore } from 'redux'
import { initialState, taskReducer } from './reducer.js'

const STORAGE_KEY = 'week9-day1-exercise-xp'

function loadState() {
  if (typeof window === 'undefined') return initialState

  try {
    const savedState = window.localStorage.getItem(STORAGE_KEY)
    if (!savedState) return initialState

    const parsedState = JSON.parse(savedState)
    if (!parsedState || !Array.isArray(parsedState.tasks)) {
      throw new TypeError('Saved Exercise XP data has an invalid format.')
    }

    return { tasks: parsedState.tasks }
  } catch (error) {
    console.error('Unable to load saved Exercise XP tasks.', error)
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
      console.error('Unable to save Exercise XP tasks to local storage.', error)
    }
  })
}
