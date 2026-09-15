const tasks = [];

const taskForm = document.querySelector('#task-form');
const taskInput = document.querySelector('#task-input');
const listTasks = document.querySelector('#listTasks');
const taskCount = document.querySelector('#task-count');

function updateTaskCount() {
    const count = tasks.length;
    taskCount.textContent = `${count} task${count === 1 ? '' : 's'}`;
}

function renderTasks() {
    listTasks.replaceChildren();

    if (tasks.length === 0) {
        const emptyState = document.createElement('p');
        emptyState.className = 'empty-state';
        emptyState.textContent = 'No tasks yet. Add one above.';
        listTasks.appendChild(emptyState);
        updateTaskCount();
        return;
    }

    tasks.forEach((task) => {
        const taskElement = document.createElement('div');
        taskElement.className = `task${task.done ? ' done' : ''}`;
        taskElement.dataset.taskId = task.task_id;

        const checkbox = document.createElement('input');
        checkbox.className = 'task-checkbox';
        checkbox.type = 'checkbox';
        checkbox.checked = task.done;
        checkbox.id = `task-${task.task_id}`;
        checkbox.addEventListener('change', () => doneTask(task.task_id));

        const label = document.createElement('label');
        label.className = 'task-label';
        label.htmlFor = checkbox.id;
        label.textContent = task.text;

        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-task';
        deleteButton.type = 'button';
        deleteButton.setAttribute('aria-label', `Delete ${task.text}`);
        deleteButton.innerHTML = '<i class="fa-solid fa-xmark" aria-hidden="true"></i>';
        deleteButton.addEventListener('click', () => deleteTask(task.task_id));

        taskElement.append(checkbox, label, deleteButton);
        listTasks.appendChild(taskElement);
    });

    updateTaskCount();
}

function addTask(event) {
    event.preventDefault();
    const text = taskInput.value.trim();

    if (!text) {
        taskInput.focus();
        return;
    }

    tasks.push({ task_id: tasks.length, text, done: false });
    taskInput.value = '';
    renderTasks();
    taskInput.focus();
}

function doneTask(taskId) {
    const task = tasks.find((item) => item.task_id === taskId);
    if (!task) return;

    task.done = !task.done;
    renderTasks();
}

function deleteTask(taskId) {
    const taskIndex = tasks.findIndex((item) => item.task_id === taskId);
    if (taskIndex === -1) return;

    tasks.splice(taskIndex, 1);
    renderTasks();
}

taskForm.addEventListener('submit', addTask);
renderTasks();
