const $addButton = document.querySelector('.work-space__add');
const $todoInput = document.querySelector('.work-space__input');
const $todoList = document.querySelector('.work-space__list');
const $todoItems = document.querySelectorAll('.item');

function requestTodoList() {
  fetch(`http://localhost:3000`)
    .then((data) => data.json())
    .then((result) => todoCreateList(result));
}

function createTodoItem(text) {
  let item = { value: `${text}` };
  fetch('http://localhost:3000', {
    method: 'POST',
    headers: {},
    body: JSON.stringify(item),
  })
    .then((res) => res.json())
    .then((data) => todoCreateList(data));
}

//! Получение списка дел
requestTodoList();

//! Добавление нового дела кнопкой
$addButton.addEventListener('click', () => {
  createTodoItem($todoInput.value);
  $todoInput.value = '';
});
//! Добавление нового дела клавишей Enter
$todoInput.addEventListener('keydown', (event) => {
  if (event.code == 'Enter') {
    createTodoItem($todoInput.value);
    $todoInput.value = '';
  }
});
//! Удаление дела
$todoList.addEventListener('click', (event) => {
  fetch(`http://localhost:3000/:${event.target.dataset.item}`, {
    method: 'DELETE',
  })
    .then((res) => res.json())
    .then((data) => todoCreateList(data));
});

function todoCreateList(items) {
  $todoList.innerHTML = '';
  for (let i = 0; i < items.length; i++) {
    $todoList.innerHTML += `<li class='item' data-item='${i}'>${items[i].value}</li>`;
  }
}
