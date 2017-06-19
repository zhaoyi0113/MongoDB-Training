const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('', (err, db) => {
  console.log("Connected successfully to server");
  const admin = db.admin();
  admin.listDatabases()
    .catch(err => {
      // console.log(err);
      return db.db(db.databaseName).collections();
    })
    .then((collections) => {
      console.log(collections);
    })
});