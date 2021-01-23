const axios = require("axios");
const db = require("./mongo");
const { OAuth2Client } = require("google-auth-library");

const GITHUB_OAUTH_CLIENT_ID = process.env.GITHUB_OAUTH_CLIENT_ID;
const GITHUB_OAUTH_CLIENT_SECRET = process.env.GITHUB_OAUTH_CLIENT_SECRET;
const authClient = new OAuth2Client(process.env.GOOGLE_OAUTH_CLIENT_ID);

const authenticateGithub = (code) => {
  axios
    .post("https://github.com/login/oauth/access_token", {
      headers: { Accept: "application/json" },
      client_id: GITHUB_OAUTH_CLIENT_ID,
      client_secret: GITHUB_OAUTH_CLIENT_SECRET,
      code: code,
    })
    .then(async (response) => {
      const queryStr = response.data;
      const accessToken = queryStr.split("=")[1].split("&")[0];
      const user = await fetchUser(accessToken);
      return user;
    });
};

const authenticateGoogle = async (token) => {
  const ticket = await authClient.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_OAUTH_CLIENT_ID,
  });

  const { name, email, picture } = ticket.getPayload();
  const user = await db.upsertUser({ name, email, picture });

  return user;
};

const fetchUser = (accessToken) => {
  axios
    .get("https://api.github.com/user", {
      headers: {
        Authorization: `token ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    })
    .then(async (response) => {
      const user = await db.upsertUser(response);
      return user;
    });
};

module.exports = { authenticateGithub, authenticateGoogle };
