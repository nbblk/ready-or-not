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

const createIndex = async () => {
  await mongoClient
    .db("test")
    .collection("user")
    .createIndex({ "article.title": "text", "article.tags": "text" });
};

const upsertUser = async (user) => {
  try {
    await createIndex();
    const updated = await mongoClient
      .db("test")
      .collection("user")
      .findOneAndUpdate(
        { email: user.email, "auth.type": user.oauthType },
        {
          $set: {
            auth: { type: user.oauthType, token: user.idToken },
          },
        },
        { upsert: true },
        { returnNewDocument: true }
      );
    return {
      _id: updated.value._id.toString(),
      email: updated.value.email,
      oauth: updated.value.auth.type,
      token: updated.value.auth.token
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
  const noteId = new ObjectID();
  const articleId = new ObjectID(data.articleId);
  try {
    await upsertArticle(data);
    await mongoClient
      .db("test")
      .collection("user")
      .findOneAndUpdate(
        { _id: ObjectID(data._id) },
        {
          $push: {
            notes: {
              articleId: articleId,
              _id: noteId,
              content: data.note,
            },
          },
        },
        { upsert: true },
        { returnNewDocument: false }
      );
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
        "notes.articleId": ObjectID(data.articleId),
      })
      .project({ notes: 1 })
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
      .find({
        _id: ObjectID(data._id),
        $text: {
          $search: data.keyword,
        },
      })
      .toArray();
      // .project({ articles: 1 })
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
  deleteNote,
  fetchArticlesByKeyword
};
