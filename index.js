require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const { OAuth2Client } = require("google-auth-library");
const MongoClient = require("mongodb").MongoClient;

const app = express();

const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(cors());
app.options("*", cors());

const port = process.env.SERVER_PORT;
const uri = process.env.MONGO_DB_URI;

const authclient = new OAuth2Client(process.env.GOOGLE_OAUTH_CLIENT_ID);

app.listen(port, () => {
  console.log(`ready-or-not server listening at http://localhost:${port}`);
});

app.post("/api/v1/auth/google", jsonParser, async (req, res) => {
  const { token } = req.body;

  const ticket = await authclient.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_OAUTH_CLIENT_ID,
  });

  const { name, email, picture } = ticket.getPayload();

  try {
    MongoClient.connect(
      uri,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      async (error, client) => {
        if (error) {
          return console.error(error);
        }
        let user = await client
          .db("test")
          .collection("user")
          .findOneAndUpdate(
            { email: email },
            { $set: { name: name, picture: picture } },
            { upsert: true },
            { returnNewDocument: true }
          );
        res.status(201);
        res.json(user);
      }
    );
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
});
