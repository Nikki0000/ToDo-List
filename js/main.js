//Находим элементы на странице
const form = document.querySelector("#form");
const taskInput = document.querySelector("#taskInput");
const tasksList = document.querySelector("#tasksList");
const emptyList = document.querySelector("#emptyList");

let tasks = [];

//Если в localStorage имеются элементы массива tasks, отображаем их
if(localStorage.getItem('tasks')){
    tasks = JSON.parse(localStorage.getItem('tasks'));
}

tasks.forEach(function (task){
    renderTask(task);
})


checkEmptyList();

//Добавление задачи
form.addEventListener("submit", addTask);

//Удаление задачи
tasksList.addEventListener("click", deleteTask);

//Отмечаем задачу завершенно
tasksList.addEventListener("click", doneTask);

function addTask(event) {
  //function declaration - их можно вызывать, до того как они объявлены в коде
  //Отменяем отправку формы (перезагрузку страницы)
  event.preventDefault();

  //Достаем текст задачи из поля ввода
  const taskText = taskInput.value;

  //Описываем задачу в виде объекта
  const newTasks = {
    id: Date.now(),
    text: taskText,
    done: false
  };

  //Добавляем задачу в массив с задачами
  tasks.push(newTasks);

  saveToLocalStorege();


  renderTask(newTasks);

  //Очищаем поле ввода и возвращаем не него фокус
  taskInput.value = "";
  taskInput.focus();

  checkEmptyList();

  
  
}

function deleteTask(event) {
  if (event.target.dataset.action !== "delete") return;

  const parentNode = event.target.closest(".list-group-item");

  //Определяем id задачи
  const id = parentNode.id;

  
  tasks = tasks.filter((task) => task.id != id)

  saveToLocalStorege();


  parentNode.remove();

  checkEmptyList();

}

function doneTask(event) {
  if (event.target.dataset.action !== "done") return;

  const parentNode = event.target.closest(".list-group-item");

  const id = parentNode.id;

  const task = tasks.find((task) => task.id == id);

  task.done = !task.done;

  saveToLocalStorege(); 

  const taskTitile = parentNode.querySelector(".task-title");
  taskTitile.classList.toggle("task-title--done");
}

//Отображаем "список дел пуст" если в массиве tasks нет элементов
function checkEmptyList() {
    if(tasks.length === 0){
        const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
                        <img src="./img/free-icon-to-do-list-1950630.png" alt="Empty" width="48" class="mt-3">
                        <div class="empty-list__title">Список дел пуст</div>
                    </li>`
        tasksList.insertAdjacentHTML('afterbegin', emptyListHTML);
    }

    if(tasks.length > 0) {
        const emptyListEl = document.querySelector('#emptyList');
        emptyListEl ? emptyListEl.remove() : null;
    }
}


function saveToLocalStorege() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}


function renderTask(task) {
    const cssClass = task.done ? "task-title task-title--done" : "task-title";

    //Формируем разметку для новой задачи
    const taskHTML = `<li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
                          <span class="${cssClass}">${task.text}</span>
                          <div class="task-item__buttons">
                              <button type="button" data-action="done" class="btn-action">
                                  <img src="./img/tick.svg" alt="Done" width="18" height="18">
                              </button>
                              <button type="button" data-action="delete" class="btn-action">
                                  <img src="./img/cross.svg" alt="Done" width="18" height="18">
                              </button>
                          </div>
                      </li>`;
  
    //Добавляем задачу в HTML
    tasksList.insertAdjacentHTML("beforeend", taskHTML);
}