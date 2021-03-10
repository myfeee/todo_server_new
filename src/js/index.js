const $addButton = document.querySelector('.work-space__add');
const $todoInput = document.querySelector('.work-space__input');
const $todoList = document.querySelector('.work-space__list');
const $todoItems = document.querySelectorAll('.item');

//! Получение всех дел из базы
function requestTodoList() {
  fetch(`http://localhost:3000`)
    .then((data) => data.json())
    .then((result) => todoCreateList(result));
}

requestTodoList();

//! Добавление дела в базу
function createTodoItem(text) {
  let item = { value: `${text}` };
  fetch('http://localhost:3000', {
    method: 'POST',
    headers: {},
    body: JSON.stringify(item),
  }).then(requestLastTodoItem());
}
//! Получение последнего дела из базы
function requestLastTodoItem() {
  fetch(`http://localhost:3000/last`)
    .then((data) => data.json())
    .then(
      (result) =>
        ($todoList.innerHTML += `<li class='item' data-item='${result._id}'>${result.value}</li>`)
    );
}

//! Добавление нового дела в базу кнопкой ДОБАВИТЬ
$addButton.addEventListener('click', () => {
  if ($todoInput.value) {
    createTodoItem($todoInput.value);
    $todoInput.value = '';
  }
});
//! Добавление нового дела клавишей Enter
$todoInput.addEventListener('keydown', (event) => {
  if (event.code == 'Enter' && $todoInput.value) {
    createTodoItem($todoInput.value);
    $todoInput.value = '';
  }
});
//! Удаление дела
$todoList.addEventListener('click', (event) => {
  fetch(`http://localhost:3000/:${event.target.dataset.item}`, {
    method: 'DELETE',
  }).then((data) => {
    if (data.statusText == 'OK')
      document
        .querySelector(`[data-item="${event.target.dataset.item}"]`)
        .remove();
  });
});

//! Отрисовка списка дел полученной из базы
function todoCreateList(items) {
  $todoList.innerHTML = '';
  for (let i = 0; i < items.length; i++) {
    $todoList.innerHTML += `<li class='item' data-item='${items[i]._id}'>${items[i].value}</li>`;
  }
}
