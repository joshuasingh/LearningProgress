var mongo = require("mongodb").MongoClient;

//mongo connection
const withDB = async (operations, res, collectionName) => {
  try {
    const client = await mongo.connect(
      "mongodb+srv://joy:Joy@1995@cluster0-szqhn.mongodb.net/test?retryWrites=true&w=majority",
      { useNewUrlParser: true, useUnifiedTopology: true }
    );

    const db = client.db("LearningProgress");
    const collection = db.collection(collectionName);

    await operations(collection, client);
  } catch (err) {
    console.log("error is in mongo ", err);
    res.json({ status: "failed", message: err.toString() }).status(401);
  }
};

module.exports = withDB;
