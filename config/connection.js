const mongoClient = require("mongodb").MongoClient;

const state = {
  db: null,
};

module.exports.connect = function (done) {
  const url = "mongodb://localhost:27017";
  const dbname = "shopping";

  mongoClient.connect(url, (err, data) => {
    console.log("Here at mongo client on collection js"); //remove
    if (err) return done(err);
    console.log("Here at mongo client on collection js POST"); //remove
    state.db = data.db(dbname);
    done();
  });
};

module.exports.get = function () {
  return state.db;
};
