const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const objectId = require('mongodb').ObjectID;

const app = express();
const mongoClient = new MongoClient('mongodb://localhost:27017/', {
  useUnified: true,
});
let dbClient;

mongoClient.connect((err, client) => {
  if (err) return console.log(err);
  dbClient = client;
  app.locals.collection = client.db('tododb').collection('todolist');
  app.listen(3000, () => {
    console.log('Server w8 connetcion');
  });
});

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8081');
  res.setHeader('Content-type', 'application/json');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE');

  next();
});

//! Обработка дел на сервере методом GET
app.get('/', (req, res) => {
  const collection = req.app.locals.collection;
  collection.find({}).toArray((err, items) => {
    if (err) return console.log(err);
    items = JSON.stringify(items);
    res.end(items);
  });
});
//! Обработка последнего дела на сервере GET
app.get('/last', (req, res) => {
  const collection = req.app.locals.collection;
  collection.find({}).toArray((err, items) => {
    if (err) return console.log(err);
    let item = items[items.length - 1];
    item = JSON.stringify(item);
    res.end(item);
  });
});

//! Создание дела на сервере методом POST
app.post('/', (req, res) => {
  let body = '';
  const collection = req.app.locals.collection;
  req.on('data', (data) => {
    body += data;
    body = JSON.parse(body);
    if (body.length > 1e6) req.connection.destroy();
  });
  req.on('end', () => {
    collection.insertOne(body, (err, result) => {
      if (err) return console.log(err);

      res.end('successfully...');
    });
  });
});

//! Удаление дела по нажатию на него методом DELETE
app.delete('/:id', (req, res) => {
  const id = new objectId(req.params.id.slice(1));
  const collection = req.app.locals.collection;
  collection.findOneAndDelete({ _id: id }, (err, result) => {
    if (err) return console.log(err);

    res.end('successfully...');
  });
});

process.on('SIGINT', () => {
  dbClient.close();
  process.exit();
});
