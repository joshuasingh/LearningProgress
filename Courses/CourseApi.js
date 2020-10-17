var express = require("express");
var router = express.Router();
var CourseObj = require("./CourseObj");
var withDB = require("../DBConnection/MongoConnect");
var ObjectId = require("mongodb").ObjectId;
var CoursesId = require("./CourseId_Generator");
const jwt = require("njwt");
const jwtKey = require("../SecurityFiles/JWTKey");

//adding the middleware

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

var route1 = router.route("/AddCourse");
var route2 = router.route("/GetAllCourses");

//Promise to push DB course to DB.
var pushCourseToDB = async (userId, myCourse, res) => {
  return new Promise((resolve, reject) => {
    var userIdNew = new ObjectId(userId);

    //the update One function creates an Entry if one is not already present. set upsert ===true to insert if not already present
    withDB(
      (collection, client) => {
        collection
          .findOneAndUpdate(
            { userId: userIdNew },
            { $push: { Courses: myCourse } },
            { upsert: true, returnOriginal: false }
          )
          .then((result, err) => {
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
};

function getAllCourses(UserId, res) {
  return new Promise((resolve, reject) => {
    //the update One function creates an Entry if one is not already present. set upsert ===true to insert if not already present
    withDB(
      (collection, client) => {
        collection
          .find({ userId: new ObjectId(UserId) })
          .toArray((err, result) => {
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

//api to add the courses to the database
route1.post(async (req, res) => {
  var { courseName, Description, TotalTime, EffortUnit } = req.body;

  var myCourse = new CourseObj(
    CoursesId(),
    courseName,
    Description,
    TotalTime,
    EffortUnit
  );

  try {
    //using temporary ID just until we created the login system
    var userId = req.userId;
    var updatedDoc = await pushCourseToDB(userId, myCourse, res);
  } catch (e) {
    res
      .json({
        status: "failed",
        message: "Unable to Insert the Value try again",
      })
      .status(401);
  }

  res.json({ status: "Success", result: updatedDoc.value }).status(200);
});

route2.post(async (req, res) => {
  var UserId = req.userId;

  try {
    var result = await getAllCourses(UserId, res);
    res.send({ result: result, status: "success" }).status(200);
  } catch (e) {
    res.send({ status: "failed", error: e }).status(401);
  }
});

module.exports = router;
