var mongo = require("mongodb").MongoClient;
var DBUrl = require("../SecurityFiles/MongoKeys");

//mongo connection
const withDB = async (operations, res, collectionName) => {
  try {
    const client = await mongo.connect(DBUrl.DBUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const db = client.db("LearningProgress");
    const collection = db.collection(collectionName);

    await operations(collection, client);
  } catch (err) {
    console.log("error is in mongo ", err);
    res.json({ status: "failed", message: err.toString() }).status(401);
  }
};

module.exports = withDB;
