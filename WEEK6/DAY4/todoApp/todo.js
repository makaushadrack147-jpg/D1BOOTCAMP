export class TodoList {
  constructor() {
    this.tasks = [];
  }

  addTask(description) {
    this.tasks.push({ description, completed: false });
  }

  completeTask(taskNumber) {
    const task = this.tasks[taskNumber - 1];
    if (task) {
      task.completed = true;
    }
  }

  listTasks() {
    return this.tasks.map((task, index) => ({
      number: index + 1,
      description: task.description,
      completed: task.completed,
    }));
  }
}
