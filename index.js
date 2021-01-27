require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./mongo");
const auth = require("./auth");

const PORT = process.env.SERVER_PORT;

const app = express();
const jsonParser = bodyParser.json();

app.use(cors());
app.options("*", cors());

db.mongoInit();

app.listen(PORT, () =>
  console.log(`ready-or-not server listening at http://localhost:${PORT}`)
);

const authorize = async (req, res, next) => {
  const oauthType = req.headers.cookie.split('; ')[0].split('=')[1];
  const token = req.headers["x-access-token"];
  try {
    await auth.authorize(oauthType, token);    
  } catch (error) {
    res.status(401);
  }
  next();
};

app.post("/api/v1/auth/:oauthType", jsonParser, async (req, res) => {
  const oauthType = req.params.oauthType;
  const token = req.body.token;
  try {
    await auth.login(oauthType, token);
  } catch (error) {
    res.status(401);
  }  
  res.status(308);
  res.cookie('oauth', oauthType, {maxAge: 10800});
  res.json(user);
});

app.post("/api/v1/article/new", jsonParser, authorize, async (req, res) => {
  const token = req.headers["x-access-token"];
  const _id = req.body._id;
  const { url, tags, due } = req.body.resource;
  const articles = await db.upsertArticle({ token, _id, url, tags, due });
  res.status(200);
  res.json(articles);
});

app.get("/api/v1/articles/:_id", jsonParser, authorize, async (req, res) => {
  const _id = req.params._id;
  const articles = await db.fetchArticles(_id);
  res.status(200);
  res.json(articles);
});

app.delete("/api/v1/articles/:_id", jsonParser, authorize, async (req, res) => {
  await db.deleteArticle({ _id: req.params._id, articleId: req.body._id });
  res.status(204);
});

app.put("/api/v1/archive/:_id", jsonParser, authorize, async (req, res) => {
  await db.upsertArchive({ _id: req.params._id, article: req.body });
  res.status(201);
});
