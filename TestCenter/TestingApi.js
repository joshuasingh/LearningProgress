var express = require("express");
var router = express.Router();
var mongoConnect = require("../DBConnection/MongoConnect");

var route1 = router.route("/");
var route2 = router.route("/getData");

//check if able to input data into database
route1.get((req, res) => {
  console.log("In testing api");
  var collectionName = "Courses_Data";

  mongoConnect(
    (collection, client) => {
      var data = { name: "joshua" };

      collection.insert(data, (err, result) => {
        if (err) {
          res.json({ status: failed }).status(401);
        }
        console.log("data inserted", result);
        res.json({ status: "ok" }).status(200);
      });
    },
    res,
    collectionName
  );
});

//check of can retrieve data from database
route2.get((req, res) => {
  var collectionName = "Courses_Data";

  mongoConnect(
    (collection, client) => {
      collection
        .find({})
        .toArray()
        .then((result, err) => {
          throw "i made this";
          if (err) {
            console.log("unable to retrieve data", err);
            res.json({ status: "error Occured", error: err }).status(401);
          } else {
            console.log("got data from mongo", result);
            res.json({ status: "OK", result: result }).status(200);
          }
        })
        .catch((e) => {
          res.json({ status: "error Occured", error: e }).status(401);
        });
    },
    res,
    collectionName
  );
});

module.exports = router;
