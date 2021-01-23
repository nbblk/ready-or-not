const MongoClient = require("mongodb").MongoClient;
const MONGO_URI = process.env.MONGO_DB_URI;
var mongoClient;

const mongoInit = async () => {
  mongoClient = await MongoClient.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).catch((error) => {
    console.error(error);
  });
};

const upsertUser = async (response) => {
    debugger;
  const user = await mongoClient
    .db("test")
    .collection("user")
    .findOneAndUpdate(
      { email: response.email },
      {
        $set: {
          name: response.name,
          picture: response.picture ? response.picture : response["avatar_url"],
        },
      },
      { upsert: true },
      { returnNewDocument: true }
    )
    .catch((err) => console.error(err));
  return user;
};

module.exports = { mongoInit, upsertUser };
