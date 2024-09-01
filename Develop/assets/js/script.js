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

    
      document.getElementById(`${task.status}-cards`).appendChild(taskElement);
      makeTaskDraggable(taskElement);
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

 
  function makeTaskDraggable(taskElement) {
      $(taskElement).draggable({
          containment: "document",
          revert: "invalid",
          helper: "clone"
      });
  }

 
  function initializeDroppable() {
      $(".card-body").droppable({
          accept: ".task",
          drop: function(event, ui) {
              const taskElement = $(ui.helper).clone().removeClass('ui-draggable-helper');
              $(this).append(taskElement);
              const newStatus = $(this).attr('id').replace('-cards', '');
              updateTaskStatus(taskElement, newStatus);
              saveTasksToLocalStorage();
              makeTaskDraggable(taskElement);
          }
      });
  }

 
  function updateTaskStatus(taskElement, newStatus) {
      const id = taskElement.data('id');
      let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
      tasks = tasks.map(t => {
          if (t.id === id) {
              t.status = newStatus;
          }
          return t;
      });
      localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  
  function saveTasksToLocalStorage() {
      const tasks = [];
      $('.task').each(function() {
          const task = {
              id: $(this).data('id'),
              title: $(this).find('h5').text(),
              description: $(this).find('p').first().text(),
              deadline: $(this).find('p').last().text().replace('Deadline: ', ''),
              status: $(this).parent().attr('id').replace('-cards', '')
          };
          tasks.push(task);
      });
      localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  
  function initializeUI() {
      initializeDroppable();
      $('.task').each(function() {
          makeTaskDraggable(this);
      });
  }

 
  loadTasks();
  initializeUI();
});