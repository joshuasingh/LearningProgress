var express = require("express");
var router = express.Router();
var withDB = require("../DBConnection/MongoConnect");
const bcrypt = require("bcrypt");
const saltRounds = 10;
var ObjectId = require("mongodb").ObjectId;

var route1 = router.route("/");
var route2 = router.route("/emailVerification");
var route3 = router.route("/userNameVerification");

var setUserName = (UserId, Uname, res) => {
  return new Promise((resolve, reject) => {
    withDB(
      (collection, client) => {
        collection.insertOne({ Uname, UserId }).then((result, err) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      },
      res,
      "UnameCollection"
    );
  });
};

var setEmail = (UserId, Email, res) => {
  return new Promise((resolve, reject) => {
    withDB(
      (collection, client) => {
        collection.insertOne({ Email, UserId }).then((result, err) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      },
      res,
      "EmailCollection"
    );
  });
};

var setUserInfo = (Uname, Email, hashPassword, res) => {
  return new Promise((resolve, reject) => {
    withDB(
      (collection, client) => {
        collection
          .insertOne({ Uname, Email, Password: hashPassword })
          .then((result, err) => {
            if (err) {
              reject(err);
            } else {
              console.log(result);
              resolve(result);
            }
          });
      },
      res,
      "Users"
    );
  });
};

var setCourses = (UserId, res) => {
  return new Promise((resolve, reject) => {
    withDB(
      (collection, client) => {
        collection.insertOne({ UserId }).then((result, err) => {
          if (err) {
            reject(err);
          } else {
            console.log(result);
            resolve(result);
          }
        });
      },
      res,
      "Courses_Data"
    );
  });
};

var checkUniqueEmail = (Email, res) => {
  return new Promise((reject, resolve) => {
    withDB(
      (collection, client) => {
        collection.find({ Email: Email }).toArray((result, err) => {
          if (err) {
            reject(err);
          } else {
            console.log(result);
            resolve(result);
          }
        });
      },
      res,
      "EmailCollection"
    );
  });
};

var checkUniqueUserName = (UserName, res) => {
  return new Promise((reject, resolve) => {
    withDB(
      (collection, client) => {
        collection.find({ Uname: UserName }).toArray((result, err) => {
          if (err) {
            reject(err);
          } else {
            console.log(result);
            resolve(result);
          }
        });
      },
      res,
      "UnameCollection"
    );
  });
};

//create new user details
route1.post(async (req, res) => {
  var { Uname, Email, Password } = req.body;

  const salt = bcrypt.genSaltSync(saltRounds);
  const hashPassword = bcrypt.hashSync(Password, salt);

  try {
    //set user info
    const { ops } = await setUserInfo(Uname, Email, hashPassword, res);

    console.log(ops[0]._id);
    var userId = ops[0]._id;
    //set username values
    await setUserName(userId, Uname, res);

    //set email values
    await setEmail(userId, Email, res);

    //set courses.
    await setCourses(userId, res);
  } catch (e) {
    res.json({ status: "failure", error: e }).status(401);
  }

  res.json({ status: "success" }).status(200);
});

//chec unique email
route2.post(async (req, res) => {
  var { Email } = req.body;

  try {
    var value = await checkUniqueEmail(Email, res);

    var isUnique = true;
    if (value.length !== 0) {
      isUnique = false;
    }
  } catch (e) {
    res.json({ status: "failed" }).status(401);
  }

  res.json({ status: "success", isUnique }).status(200);
});

//check unique username
route3.post(async (req, res) => {
  var { UserName } = req.body;

  try {
    var value = await checkUniqueUserName(UserName, res);

    var isUnique = true;
    if (value.length !== 0) {
      isUnique = false;
    }
  } catch (e) {
    res.json({ status: "failed" }).status(401);
  }

  res.json({ status: "success", isUnique }).status(200);
});

module.exports = router;
