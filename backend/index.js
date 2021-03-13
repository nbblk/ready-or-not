require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const { createProxyMiddleware } = require("http-proxy-middleware");
const bodyParser = require("body-parser");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const { v4: uuidv4 } = require("uuid");

const cors = require("cors");
const db = require("./mongo");
const auth = require("./auth");
const scrapPage = require("./puppeteer");
const convertNotes = require("./exportFile");

const PORT = (process.env.PORT || 8080);
const URI = process.env.MONGO_DB_URI;
const SERVER_DOMAIN = process.env.SERVER_DOMAIN;
const CLIENT_DOMAIN = process.env.CLIENT_DOMAIN;

const app = express();
const store = new MongoDBStore({
  uri: URI,
  collection: "mySessions",
});

store.on("error", (error) => {
  console.error(error);
});

const proxyOption = {
  target: SERVER_DOMAIN,
  changeOrigin: true
};
const corsOption = {
  credentials: true,
  origin: true,
};
const sessOption = {
  genid: function (req) {
    return uuidv4(); // use UUIDs for session IDs
  },
  name: "session",
  secret: "thisissecret",
  resave: true,
  saveUninitialized: true,
  cookie: {
    path: "/",
    domain: CLIENT_DOMAIN,
    httpOnly: false,
    secure: false,
    maxAge: 36000,
    //    sameSite: 'false'
  },
  store: store,
};

const apiProxy = createProxyMiddleware("/api/v1/**", proxyOption);

if (app.get("env") === "production") {
  app.set("trust proxy", 1); // trust first proxy
  sessOption.cookie.secure = true; // serve secure cookies
}

app.use(apiProxy);
app.use(morgan("dev")); // logging
app.use(cors(corsOption));
app.options("*", cors());
app.use(session(sessOption));

const jsonParser = bodyParser.json();

db.mongoInit();

app.listen(PORT, () =>
  console.log(`ready-or-not server listening at http://localhost:${PORT}`)
);

const errorHandler = (err, req, res, next) => {
  if (res.headerSent) {
    return next(err);
  }
  res.status(err.status).send(err.statusText);
};

const authorize = async (req, res, next) => {
  if (!req.session.id) {
    errorHandler(
      { status: 401, statusText: "session expired. please login again" },
      req,
      res,
      next
    );
  } else {
    next();
  }
};

app.post("/api/v1/auth", jsonParser, async (req, res) => {
  try {
    const user = await auth.login(req.body.oauthType, req.body.token);
    if (!req.session.id) {
      req.session.regenerate((err) => {
        console.error(err);
        throw new Error("failed to renegerate session");
      });
    }
    res.json(user);
    res.status(201);
  } catch (error) {
    errorHandler(
      { status: 401, statusText: error.message, error: error },
      req,
      res
    );
  }
});

app.get("/api/v1/articles", authorize, async (req, res) => {
  try {
    const articles = await db.fetchArticles(req.query.uid);
    res.status(200);
    res.json(articles);
  } catch (error) {
    errorHandler({ status: 500, statusText: error.message }, req, res, next);
  }
});

app.post("/api/v1/article/new", jsonParser, authorize, async (req, res) => {
  try {
    const _id = req.query.uid;
    const { url, tags, due } = req.body.article;
    // scrape thumbnail, title form the url
    const { title, image } = await scrapPage(url);
    const articles = await db.upsertArticle({
      _id,
      url,
      tags,
      due,
      title,
      image,
    });
    res.status(201);
    res.json(articles);
  } catch (error) {
    console.log(error);
    res.status(500);
  }
});

app.delete("/api/v1/articles", jsonParser, authorize, async (req, res) => {
  try {
    await db.deleteArticle({ _id: req.query.uid, articleId: req.body._id });
    res.sendStatus(200);
  } catch (error) {
    res.status(500);
  }
});

app.put("/api/v1/archive", jsonParser, authorize, async (req, res) => {
  try {
    await db.upsertArchive({ _id: req.query.uid, article: req.body });
    res.sendStatus(201);
  } catch (error) {
    res.status(500);
  }
});

app.get("/api/v1/archive", jsonParser, authorize, async (req, res) => {
  try {
    const response = await db.fetchArchive(req.query.uid);
    res.status(200);
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500);
  }
});

app.delete("/api/v1/archive", jsonParser, authorize, async (req, res) => {
  try {
    await db.deleteArchive({ _id: req.query.uid, articleId: req.body._id });
    res.sendStatus(200);
  } catch (error) {
    res.status(500);
  }
});

app.post("/api/v1/notes/new", jsonParser, authorize, async (req, res) => {
  try {
    const response = await db.upsertNote({
      ...req.body.note,
      articleId: req.body.note._id,
      _id: req.query.uid,
      fieldName: JSON.parse(req.query.archived) ? "archived" : "articles",
    });
    res.json(response);
    res.status(201);
  } catch (error) {
    res.status(500);
  }
});

app.get("/api/v1/notes", jsonParser, authorize, async (req, res) => {
  try {
    const response = await db.fetchNotes({
      _id: req.query.uid,
      articleId: req.query.articleId,
      fieldName: JSON.parse(req.query.archived) ? "archived" : "articles",
    });
    res.json(response);
    res.status(200);
  } catch (error) {
    console.error(error);
    res.status(500);
  }
});

app.delete("/api/v1/notes", jsonParser, authorize, async (req, res) => {
  try {
    await db.deleteNote({
      _id: req.query.uid,
      articleId: req.query.articleId,
      noteId: req.body.noteId,
    });
    res.sendStatus(201);
  } catch (error) {
    console.error(error);
    res.status(500);
  }
});

app.get("/api/v1/search", jsonParser, authorize, async (req, res) => {
  try {
    const result = await db.fetchArticlesByKeyword({
      _id: req.query.uid,
      keyword: req.query.keyword,
      fieldName: JSON.parse(req.query.archived) ? "archived" : "articles",
    });
    res.status(200);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500);
  }
});

app.get("/api/v1/export", authorize, async (req, res) => {
  try {
    const data = await convertNotes({
      _id: req.query.uid,
      articleId: req.query.articleId,
      fileType: req.query.type,
    });
    res.status(200);
    res.send(data);
  } catch (error) {
    console.error(error);
    res.status(500);
  }
});
