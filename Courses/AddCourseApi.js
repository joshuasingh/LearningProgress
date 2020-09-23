var express = require("express");
var router = express.Router();
var CourseObj = require("./CourseObj");
var withDB = require("../DBConnection/MongoConnect");
var route1 = router.route("/AddCourse");
var ObjectId = require("mongodb").ObjectId;
var CoursesId = require("./CourseId_Generator");

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
            { upsert: true, returnNewDocument: true }
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

//api to add the courses to the database
route1.post(async (req, res) => {
  var {
    courseName,
    Description,
    TotalTime, //total time is to be considered in hours
    PerWeek_effort, //perweek effort to be considered in hours
    PerDay_Effort, //perDay_effort to be considered in hours
  } = req.body;

  var myCourse = new CourseObj(
    CoursesId(),
    courseName,
    Description,
    TotalTime,
    PerWeek_effort,
    PerDay_Effort
  );

  try {
    //using temporary ID just until we created the login system
    var userId = "5f62519eb8f27a2d8c2f1642";
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

module.exports = router;
