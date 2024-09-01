document.addEventListener('DOMContentLoaded', () => {
  const addTaskButton = document.getElementById('save-task-button');
  const titleInput = document.getElementById('task-title');
  const descriptionInput = document.getElementById('task-description');
  const deadlineInput = document.getElementById('datepicker');

  function createTaskElement(task) {
      const taskElement = document.createElement('div');
      taskElement.classList.add('task', 'border', 'border-secondary', 'rounded', 'p-2', 'mb-2');
      taskElement.dataset.id = task.id;
      taskElement.innerHTML = `
          <h5>${task.title}</h5>
          <p>${task.description}</p>
          <p><small class="text-muted">Deadline: ${task.deadline}</small></p>
          <button class="btn btn-danger btn-sm float-end" onclick="deleteTask('${task.id}')">Delete</button>
      `;

      
      document.getElementById('todo-cards').appendChild(taskElement);
  }

  function saveTask(task) {
      const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
      tasks.push(task);
      localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  window.deleteTask = function(id) {
      let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
      tasks = tasks.filter(task => task.id !== id);
      localStorage.setItem('tasks', JSON.stringify(tasks));

      document.querySelector(`.task[data-id="${id}"]`).remove();
  }

  addTaskButton.addEventListener('click', () => {
      const title = titleInput.value;
      const description = descriptionInput.value;
      const deadline = deadlineInput.value;
      const id = Date.now().toString(); 

      if (title && deadline) {
          const task = {
              id,
              title,
              description,
              deadline,
              status: 'todo'
          };
          saveTask(task);
          createTaskElement(task);
          
          const modal = bootstrap.Modal.getInstance(document.getElementById('formModal'));
          modal.hide();
          
          titleInput.value = '';
          descriptionInput.value = '';
          deadlineInput.value = '';
      }
  });

 
  function loadTasks() {
      const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
      tasks.forEach(task => createTaskElement(task));
  }

  loadTasks();
});
