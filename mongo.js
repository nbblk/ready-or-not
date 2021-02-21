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
  try {
    const updated = await mongoClient
      .db("test")
      .collection("user")
      .findOneAndUpdate(
        { "auth.type": user.oauthType, "auth.sub": user.sub },
        {
          $set: {
            email: user.email,
            "auth.type": user.oauthType,
            "auth.sub": user.sub ? user.sub : null
          },
        },
        { upsert: true },
        { returnNewDocument: true },
        { returnOriginal: false }
      );
    return {
      _id: updated.value._id.toString(),
      email: updated.value.email,
      oauth: updated.value.auth.type
    };
  } catch (error) {
    console.error(error);
  }
};

const upsertArticle = async (data) => {
  const articleId = data.articleId ? ObjectID(data.articleId) : new ObjectID();
  const updated = await mongoClient
    .db("test")
    .collection("user")
    .findOneAndUpdate(
      { _id: ObjectID(data._id) },
      {
        $push: {
          articles: {
            _id: articleId,
            url: data.url,
            tags: data.tags,
            due: data.due,
            title: data.title,
            image: data.image,
            notes: []
          },
        },
      },
      { upsert: true },
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
     const article = await mongoClient
      .db("test")
      .collection("user")
      .findOneAndUpdate(
        {
          _id: new ObjectID(data._id),
        },
        {
          $pull: {
            articles: { _id: new ObjectID(data.articleId) },
          },
        }
      );
    return article;
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
            archived: {...data.article, _id: ObjectID(data.article._id)}
          },
        },
        { upsert: false },
        { returnNewDocument: false }
      );
  } catch (error) {
    console.error(error);
  }
};

const fetchArchive = async (_id) => {
  try {
    const archived = await mongoClient
      .db("test")
      .collection("user")
      .find({ _id: new ObjectID(_id) })
      .project({ archived: 1 })
      .toArray();
    return archived;
  } catch (error) {
    console.error(error);
  }
};

const deleteArchive = async (data) => {
  try {
    await mongoClient
      .db("test")
      .collection("user")
      .findOneAndUpdate(
        { _id: new ObjectID(data._id) },
        {
          $pull: { archived: { _id: new ObjectID(data.articleId) } },
        }
      );
  } catch (error) {
    console.error(error);
  }
};

const upsertNote = async (data) => {
  try {
    const doc = await mongoClient
      .db("test")
      .collection("user")
      .updateOne(
        { _id: ObjectID(data._id), "articles._id": ObjectID(data.articleId) },
        {
          $addToSet: {
            "articles.$.notes": {
              _id: ObjectID(data.noteId),
              content: data.note,
            },
          },
        },
        { $set: { "articles.$.tags": data.tags, "articles.$.due": data.due } },
        { upsert: true },
        { returnNewDocument: true }
      );
    return doc;
  } catch (error) {
    console.error(error);
  }
};

const fetchNotes = async (data) => {
  try {
    const notes = await mongoClient
      .db("test")
      .collection("user")
      .find({
        _id: ObjectID(data._id),
        "articles._id": ObjectID(data.articleId),
      })
      .project({ _id: 0, auth: 0, email: 0 })
      .project({ _id: 0, "articles.notes": 1 })
      .toArray();
    return notes;
  } catch (error) {
    console.error(error);
  }
};

const fetchAllNotes = async (_id) => {
  try {
    const notes = await mongoClient
      .db("test")
      .collection("user")
      .aggregate([
        { $match: { _id: ObjectID(_id) } },
        { $unwind: "$doc" },
        { $project: { _id: 0, auth: 0, email: 0 } },
      ])
      .toArray();
    return notes;
  } catch (error) {
    console.error(error);
  }
};

const deleteNote = async (data) => {
  try {
    await mongoClient
      .db("test")
      .collection("user")
      .findOneAndUpdate(
        { _id: ObjectID(data._id) },
        {
          $pull: { notes: { _id: new ObjectID(data.noteId) } },
        }
      );
  } catch (error) {}
};

const fetchArticlesByKeyword = async (data) => {
  try {
    const result = await mongoClient
      .db("test")
      .collection("user")
      .aggregate(
        { $match: { _id: ObjectID(data._id) } },
        { $unwind: "$articles" },
        { $match: { "articles.title": { $regex: data.keyword } } },
        { $project: { "articles": 1, _id: 0 } },
        { $project: { "articles": 1 } }
      )
      .toArray();
    return result;
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
  upsertArchive,
  fetchArchive,
  deleteArchive,
  upsertNote,
  fetchNotes,
  fetchAllNotes,
  deleteNote,
  fetchArticlesByKeyword
};
