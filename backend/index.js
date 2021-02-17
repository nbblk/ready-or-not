require("dotenv").config();
const express = require("express");
//const session = require('express-session');
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./mongo");
const auth = require("./auth");
const scrapPage = require("./puppeteer");

const PORT = process.env.SERVER_PORT;

const app = express();
//var genuuid = require('uuid-v4')
const jsonParser = bodyParser.json();
const corsConfig = {
  credentials: true,
  origin: true,
};
// app.use(
//   session({
//     name: "sesionCookie",
//     genid: (req) => genuuid(),
//     secret: "thisissecret",
//     saveUninitialized: false,
//     resave: false,
//     cookie: { secure: false, expires: 60000 }
//   })
// );
app.use(cors(corsConfig));
app.options("*", cors());
db.mongoInit();

app.listen(PORT, () =>
  console.log(`ready-or-not server listening at http://localhost:${PORT}`)
);

const authorize = async (req, res, next) => {
  const oauthType = req.query.oauth;
  const token = req.headers["x-access-token"];
  try {
    if (!token) {
      throw Error('access token not exists');
    } else {
      await auth.authorize(oauthType, token);     
      next();
    }
  } catch (error) {
    res.sendStatus(401);
  }
};

app.post("/api/v1/auth", jsonParser, async (req, res) => {
  const oauthType = req.body.oauthType;
  let token;
  if (oauthType === "github") {
    token = req.body.code;
  }

  if (oauthType === "google") {
    token = req.body.token;
  }
  try {
    const user = await auth.login(oauthType, token);
    req.session.token = user.token;
    res.status(201);
    res.json(user);
  } catch (error) {
    res.status(401);
  }
});

app.get("/api/v1/articles", authorize, async (req, res) => {
  try {
    const articles = await db.fetchArticles(req.query.uid);
    res.status(200);
    res.json(articles);
  } catch (error) {
    res.status(500);
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
    await db.upsertNote({
      ...req.body.note,
      articleId: req.body.note._id,
      _id: req.query.uid,
    });
    res.sendStatus(201);
  } catch (error) {
    res.status(500);
  }
});

app.get("/api/v1/notes", jsonParser, authorize, async (req, res) => {
  try {
    const response = await db.fetchNotes({
      _id: req.query.uid,
      articleId: req.query.articleId,
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
    });
    res.status(200);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500);
  }
});
