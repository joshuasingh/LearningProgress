var express = require("express");
var router = express.Router();
var withDB = require("../DBConnection/MongoConnect");
var ObjectId = require("mongodb").ObjectId;
const jwt = require("njwt");
const jwtKey = require("../SecurityFiles/JWTKey");

var tokenCheck = function (req, res, next) {
  var { token } = req.headers;
  console.log(token);
  jwt.verify(token, jwtKey, (err, verifiedJwt) => {
    if (err) {
      res.send({ status: "success", message: "notUser" }).status(200);
    } else {
      console.log(verifiedJwt.body.id);
      req.userId = verifiedJwt.body.id;
      next();
    }
  });
};

router.use(tokenCheck);

var route1 = router.route("/");

function getAllCourses(UserId, res) {
  return new Promise((resolve, reject) => {
    //the update One function creates an Entry if one is not already present. set upsert ===true to insert if not already present
    withDB(
      (collection, client) => {
        collection.findAll({}).then((result, err) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      },
      res,
      "Courses_Data"
    );
  });
}

route1.get((req, res) => {
  var { UserId } = req.body;

  try {
    var result = getAllCourses(UserId, res);
    console.log("the result", result);
  } catch (e) {
    console.log("error caused", e);
  }
});

module.exports = router;
