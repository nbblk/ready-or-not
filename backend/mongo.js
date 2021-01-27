const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;
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

const upsertUser = async (user) => {
  const updated = await mongoClient
    .db("test")
    .collection("user")
    .findOneAndUpdate(
      { email: user.email },
      {
        $set: {
          auth: { type: user.oauthType, token: user.accessToken },
          name: user.name,
          picture: user.picture ? user.picture : user["avatar_url"],
        },
      },
      { upsert: true },
      { returnNewDocument: true }
    )
    .catch((err) => console.error(err));
  return updated;
};

const upsertArticle = async (article) => {
  const articleId = new ObjectID();
  const updated = await mongoClient
    .db("test")
    .collection("user")
    .findOneAndUpdate(
      { _id: ObjectID(article._id) },
      {
        $push: {
          articles: {
            _id: articleId,
            url: article.url,
            tags: article.tags,
            due: article.due,
          },
        },
      },
      { upsert: false },
      { returnNewDocument: false }
    )
    .catch((err) => console.error(err));

  return updated;
};

const fetchArticles = async (_id) => {
  try {
    const articles = await mongoClient
      .db("test")
      .collection("user")
      .find({ _id: new ObjectID(_id) })
      .project({ articles: 1 })
      .toArray();
    return articles;
  } catch (error) {
    console.error(error);
  }
};

const deleteArticle = async (data) => {
  try {
     await mongoClient
      .db("test")
      .collection("user")
      .update(
        {
          _id: new ObjectID(data._id),
        },
        {
          $pull: {
            articles: { _id: new ObjectID(data.articleId) },
          },
        }
      );
  } catch (error) {
    console.error(error);
  }
};

const upsertArchive = async (data) => {
  try {
    await deleteArticle({ _id: data._id, articleId: data.article._id });
    await mongoClient
      .db("test")
      .collection("user")
      .findOneAndUpdate(
        {
          _id: new ObjectID(data._id),
        },
        {
          $push: {
            archived: { article: data },
          },
        },
        { upsert: false },
        { returnNewDocument: false }
      );
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  mongoInit,
  upsertUser,
  upsertArticle,
  fetchArticles,
  deleteArticle,
  upsertArchive
};
