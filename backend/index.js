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

app.post("/api/v1/auth/github", jsonParser, async (req, res) => {
  const { code } = req.body;
  const user = await auth.authenticateGithub(code);
  res.status(201);
  res.json(user);
});

app.post("/api/v1/auth/google", jsonParser, async (req, res) => {
  const { token } = req.body;
  const user = await auth.authenticateGoogle(token);
  res.status(201);
  res.json(user);
});
