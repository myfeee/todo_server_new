const express = require('express');
const fs = require('fs');

let todoList = [];

const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8081');
  res.setHeader('Content-type', 'application/json');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE');

  next();
});

//! Получение дел на сервере методом GET
app.get('/', (req, res) => {
  let base = fs.readFileSync('base.json', 'utf8');
  base = JSON.parse(base);
  for (let i = 0; i < base.length; i++) todoList[i] = base[i];

  if (typeof todoList == 'string') todoList = JSON.parse(todoList);

  todoList = JSON.stringify(todoList);
  res.end(todoList);
});

//! Создание дела на сервере методом POST
app.post('/', (req, res) => {
  let body = '';
  req.on('data', (data) => {
    body += data;
    body = JSON.parse(body);
    if (body.length > 1e6) req.connection.destroy();
  });
  req.on('end', () => {
    if (typeof todoList == 'string') todoList = JSON.parse(todoList);
    todoList.push(body);
    todoList = JSON.stringify(todoList);
    fs.writeFile('base.json', todoList, () => {});
  });
  setTimeout(() => {
    res.end(todoList);
  }, 0);
});

//! Удаление дела по нажатию на него мутодом DELETE
app.delete('/:id', (req, res) => {
  let id = req.params.id;
  if (typeof todoList == 'string') todoList = JSON.parse(todoList);
  id = +id.slice(1);
  todoList.splice(id, 1);
  todoList = JSON.stringify(todoList);
  fs.writeFile('base.json', todoList, () => {});
  res.end(todoList);
});

app.listen(3000);
