const _ = require('lodash');
const MongoClient = require('mongodb').MongoClient,
  assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017/school';

// Use connect method to connect to the server
new Promise((resolve, reject) => {
  MongoClient.connect(url, (err, db) => {
    assert.equal(null, err);
    console.log("Connected successfully to server");
    resolve(db);
  });
}).then((db) => {
  return db.collection('students');
}).then((col) => {
  console.log('get collection successfully');
  return col.aggregate([{
      $unwind: "$scores"
    }, {
      $match: { "scores.type": "homework" }
    },
    {
      $group: { _id: "$_id", minScore: { $min: "$scores.score" } }
    }
  ], (err, results) => {
    query(col, results);
  });
});

const query = (col, result) => {
  console.log(result);
  result.map((r) => {
    const d = col.find({ _id: r._id }).toArray((err, docs) => {
      console.log('min=', r);
      console.log('before:', docs[0].scores);
      // const minvalue = Math.min.apply(0, docs[0].scores.map((o) => o.score));
      // console.log('min:', minvalue);
      const filtered = _.filter(docs[0].scores, (o) => o.type !== 'homework' || o.score !== r.minScore);
      console.log('filter:', filtered)
      col.update({ _id: r._id }, { $set: { scores: filtered } })
        .then((result) => {})
    });

  })
}