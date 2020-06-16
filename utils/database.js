// const Sequelize = require('sequelize');

// const sequelize = new Sequelize('nodejs-basics','root','root',{
//     host: 'localhost',
//     dialect: 'mysql'
// });

// module.exports = sequelize;
// mQb9UEXQEZICafRm
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const uri = 'mongodb://localhost:27017/shop';
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let _db;

const mongoConnect = () =>
  new Promise((resolve, reject) => {
    client
      .connect()
      .then((cli) => {
        _db = cli.db();
        resolve();
      })
      .catch(reject);
  });

exports.getDB = () => {
  if (_db) {
    return _db;
  }
  throw 'No Database found';
};

exports.mongoConnect = mongoConnect;
