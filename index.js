var http = require("http");
var app = require("express")();
var cors = require("cors");
var bodyParser = require("body-parser");
app.use(cors());
app.use(bodyParser.json({ limit: "10mb", extended: false }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));

var testApi = require("./TestCenter/TestingApi");
var courseDets = require("./Courses/CourseApi");
var userSignUp = require("./UserInfo/SignUp");
var userSignIn = require("./UserInfo/SignIn");

app.use("/testingApi", testApi);
app.use("/courses", courseDets);
app.use("/createUser", userSignUp);
app.use("/signInUser", userSignIn);

var port = process.env.Port || 8081;

var server = http.createServer(app);

//server is listening
server.listen(port, () => {
  console.log(`the Server is up and Running ${port}`);
});

app.get("/testValue", (req, res) => {
  res.send("this is working fine").status(200);
});
