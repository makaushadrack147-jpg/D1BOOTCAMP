import { ADD_TASK, DELETE_TASK, EDIT_TASK, TOGGLE_TASK } from './actions.js'

export const initialState = {
  tasksByDate: {},
}

export function taskReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_TASK: {
      const { date, task } = action.payload
      return {
        ...state,
        tasksByDate: {
          ...state.tasksByDate,
          [date]: [...(state.tasksByDate[date] ?? []), task],
        },
      }
    }
    case EDIT_TASK: {
      const { date, id, changes } = action.payload
      return {
        ...state,
        tasksByDate: {
          ...state.tasksByDate,
          [date]: (state.tasksByDate[date] ?? []).map((task) =>
            task.id === id ? { ...task, ...changes } : task,
          ),
        },
      }
    }
    case DELETE_TASK: {
      const { date, id } = action.payload
      return {
        ...state,
        tasksByDate: {
          ...state.tasksByDate,
          [date]: (state.tasksByDate[date] ?? []).filter((task) => task.id !== id),
        },
      }
    }
    case TOGGLE_TASK: {
      const { date, id } = action.payload
      return {
        ...state,
        tasksByDate: {
          ...state.tasksByDate,
          [date]: (state.tasksByDate[date] ?? []).map((task) =>
            task.id === id ? { ...task, completed: !task.completed } : task,
          ),
        },
      }
    }
    default:
      return state
  }
}
