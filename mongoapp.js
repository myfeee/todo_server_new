const MongoClient = require('mongodb').MongoClient;

const mongoClient = new MongoClient('mongodb://localhost:27017/', {
  useUnifiedTopology: true,
});

const array = [];

mongoClient.connect((err, client) => {
  const db = client.db('test');
  const collection = db.collection('users');
  // let user = { name: 'Jery', age: 18 };
  if (err) return console.log(err);

  collection.find().toArray((err, result) => {
    console.log(result);
    client.close();
  });
});
