require("dotenv").config({ path: `./.env.${process.env.NODE_ENV}` });
const express = require("express");

const http = require("http");
const https = require("https");
const fs = require("fs");

const morgan = require("morgan");
const bodyParser = require("body-parser");
const session = require("express-session");
const { v4: uuidv4 } = require("uuid");
const cors = require("cors");

const db = require("./mongo");

const auth = require("./auth");

const scrapPage = require("./puppeteer");
const convertNotes = require("./exportFile");

const SCHEME = process.env.SCHEME;
const PORT = process.env.PORT || 8080;
const SERVER_DOMAIN = process.env.SERVER_DOMAIN;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN;
const NODE_ENV = process.env.NODE_ENV;

db.mongoInit().then(() => {
  console.log("db connected");
});

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
    domain: CLIENT_ORIGIN,
    httpOnly: false,
    secure: true,
    maxAge: 36000,
  },
};

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.options("*", cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan("dev")); // logging
app.use(session(sessOption));

if (NODE_ENV === "production" || NODE_ENV === "prod") {
  http.createServer(app).listen(PORT, () => {
    console.log(`listening on ${SCHEME}://${SERVER_DOMAIN}:${PORT}`);
  });
} else if (NODE_ENV === "development") {
  https
    .createServer(
      {
        key: fs.readFileSync(process.env.KEY_PATH),
        cert: fs.readFileSync(process.env.CERT_PATH),
      },
      app
    )
    .listen(PORT, () => {
      console.log(`listening on ${SCHEME}://${SERVER_DOMAIN}:${PORT}`);
    });
} else {
  console.error("NODE_ENV not set");
}

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

app.get("/", (req, res) => {
  res.send("server is running !");
});

app.post("/auth", async (req, res) => {
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

app.get("/articles", authorize, async (req, res) => {
  try {
    const articles = await db.fetchArticles(req.query.uid);
    res.status(200);
    res.json(articles);
  } catch (error) {
    errorHandler({ status: 500, statusText: error.message }, req, res, next);
  }
});

app.post("/article/new", authorize, async (req, res) => {
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

app.delete("/articles", authorize, async (req, res) => {
  try {
    await db.deleteArticle({ _id: req.query.uid, articleId: req.body._id });
    res.sendStatus(200);
  } catch (error) {
    res.status(500);
  }
});

app.put("/archive", authorize, async (req, res) => {
  try {
    await db.upsertArchive({ _id: req.query.uid, article: req.body });
    res.sendStatus(201);
  } catch (error) {
    res.status(500);
  }
});

app.get("/archive", authorize, async (req, res) => {
  try {
    const response = await db.fetchArchive(req.query.uid);
    res.status(200);
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500);
  }
});

app.delete("/archive", authorize, async (req, res) => {
  try {
    await db.deleteArchive({ _id: req.query.uid, articleId: req.body._id });
    res.sendStatus(200);
  } catch (error) {
    res.status(500);
  }
});

app.post("/notes/new", authorize, async (req, res) => {
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

app.get("/notes", authorize, async (req, res) => {
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

app.delete("/notes", authorize, async (req, res) => {
  try {
    await db.deleteNote({
      _id: req.query.uid,
      articleId: req.query.articleId,
      fieldName: JSON.parse(req.query.archived) ? "archived" : "articles",
      noteId: req.body.noteId,
    });
    res.sendStatus(201);
  } catch (error) {
    console.error(error);
    res.status(500);
  }
});

app.get("/search", authorize, async (req, res) => {
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

app.get("/export", authorize, async (req, res) => {
  try {
    const data = await convertNotes({
      _id: req.query.uid,
      articleId: req.query.articleId,
      fileType: req.query.type,
      fieldName: JSON.parse(req.query.archived) ? "archived" : "articles",
    });
    res.status(200);
    res.send(data);
  } catch (error) {
    console.error(error);
    res.status(500);
  }
});
