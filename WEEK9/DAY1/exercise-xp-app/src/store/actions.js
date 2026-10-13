export const ADD_TASK = 'exerciseXp/addTask'
export const EDIT_TASK = 'exerciseXp/editTask'
export const DELETE_TASK = 'exerciseXp/deleteTask'
export const TOGGLE_TASK = 'exerciseXp/toggleTask'

function createId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`
}

export function addTask(title) {
  return {
    type: ADD_TASK,
    payload: { id: createId(), title, completed: false },
  }
}

export function editTask(id, title) {
  return { type: EDIT_TASK, payload: { id, title } }
}

export function deleteTask(id) {
  return { type: DELETE_TASK, payload: id }
}

export function toggleTask(id) {
  return { type: TOGGLE_TASK, payload: id }
}
