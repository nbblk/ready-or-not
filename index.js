require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./mongo");
const auth = require("./auth");

const PORT = process.env.SERVER_PORT;

const app = express();
const jsonParser = bodyParser.json();
const corsConfig = {
  credentials: true,
  origin: true,
};
app.use(cookieParser());
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
    await auth.authorize(oauthType, token);    
    next();
  } catch (error) {
    res.status(401);
  } 
};

app.post("/api/v1/auth/:oauthType", jsonParser, async (req, res) => {
  const oauthType = req.params.oauthType;
  const token = req.body.token.token;
  try {
    const user = await auth.login(oauthType, token);
    user.oauth = oauthType;
    res.status(201);
    res.json(user);
  } catch (error) {
    res.status(401);
  }
});

app.get("/api/v1/articles", authorize, async (req, res) => {
  try {
    const _id = req.query.uid;
    const articles = await db.fetchArticles(_id);
    res.status(200);
    res.json(articles);   
  } catch (error) {
    res.status(500);
  }
});

app.post("/api/v1/article/new", jsonParser, authorize, async (req, res) => {
  try {
    const _id = req.query.uid;
    const { url, tags, due } = req.body.resource;
    const articles = await db.upsertArticle({ _id, url, tags, due });
    res.status(201);
    res.json(articles);      
  } catch (error) {
    res.status(500);
  }
});

app.delete("/api/v1/articles/:_id", jsonParser, authorize, async (req, res) => {
  await db.deleteArticle({ _id: req.params._id, articleId: req.body._id });
  res.status(204);
});

app.put("/api/v1/archive/:_id", jsonParser, authorize, async (req, res) => {
  await db.upsertArchive({ _id: req.params._id, article: req.body });
  res.status(201);
});
