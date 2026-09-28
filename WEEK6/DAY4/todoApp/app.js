import { TodoList } from "./todo.js";

const todoList = new TodoList();
todoList.addTask("Study JavaScript modules");
todoList.addTask("Practice Node.js file management");
todoList.addTask("Review npm packages");
todoList.completeTask(1);

console.table(todoList.listTasks());
