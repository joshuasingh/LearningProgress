var express = require("express");
var router = express.Router();
var withDB = require("../DBConnection/MongoConnect");
const bcrypt = require("bcrypt");
const saltRounds = 10;
var ObjectId = require("mongodb").ObjectId;
const jwt = require("njwt");
const jwtKey = require("../SecurityFiles/JWTKey");

var route1 = router.route("/");

var verifyUser = (UserName, res) => {
  return new Promise((resolve, reject) => {
    withDB(
      (collection, client) => {
        collection.find({ Uname: UserName }).toArray((err, result) => {
          if (err) {
            console.log("error is", err);
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

//create jwt token
var createToken = (user) => {
  const claims = { UserName: user.Uname, id: user._id };
  console.log(claims);
  const token = jwt.create(claims, jwtKey);
  token.setExpiration(new Date().getTime() + 900 * 1000);

  return token.compact();
};

//verify the username and password
route1.post(async (req, res) => {
  var { UserName, Password } = req.body;

  var AuthUser = false;
  var token = null;

  try {
    var user = await verifyUser(UserName, res);

    if (user.length !== 0) {
      const match = await bcrypt.compare(Password, user[0].Password);
      console.log("match value", match);
      if (match) {
        AuthUser = true;
        token = createToken(user[0]);
      }
    }
  } catch (e) {
    console.log("error occured", e);
    res.json({ status: "failure", error: e }).status(401);
  }

  res.json({ status: "success", token: token }).status(200);
});

module.exports = router;
