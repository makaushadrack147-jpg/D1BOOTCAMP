export const ADD_TASK = 'tasks/add'
export const EDIT_TASK = 'tasks/edit'
export const DELETE_TASK = 'tasks/delete'
export const TOGGLE_TASK = 'tasks/toggle'

function createId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`
}

export function addTask(date, title, time) {
  return {
    type: ADD_TASK,
    payload: { date, task: { id: createId(), title, time, completed: false } },
  }
}

export function editTask(date, id, changes) {
  return { type: EDIT_TASK, payload: { date, id, changes } }
}

export function deleteTask(date, id) {
  return { type: DELETE_TASK, payload: { date, id } }
}

export function toggleTask(date, id) {
  return { type: TOGGLE_TASK, payload: { date, id } }
}
