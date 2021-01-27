const axios = require("axios");
const db = require("./mongo");
const { OAuth2Client } = require("google-auth-library");

const GITHUB_OAUTH_CLIENT_ID = process.env.GITHUB_OAUTH_CLIENT_ID;
const GITHUB_OAUTH_CLIENT_SECRET = process.env.GITHUB_OAUTH_CLIENT_SECRET;
const authClient = new OAuth2Client(process.env.GOOGLE_OAUTH_CLIENT_ID);

const login = async (oauthType, token) => {
  let user;
  if (oauthType === "google") {
    user = await loginWithGoogle(oauthType, token);
  }
  if (oauthType === "github") {
    user = await loginWithGithub({ oauthType, token });
  }
  return user, token;
};

const authorize = async (oauthType, token) => {
  if (oauthType === "google") {
    await verifyGoogleToken(token);
  }
  if (oauthType === "github") {
    await verifyGithubToken(token);
  }
};

const verifyGoogleToken = async (token) => {
  const ticket = await authClient.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_OAUTH_CLIENT_ID,
  });
  return { ticket, token };
};

const loginWithGoogle = async (oauthType, token) => {
  const verified = await verifyGoogle(token);
  const { name, email, picture } = verified.ticket.getPayload();
  const accessToken = verified.token;
  const user = await db.upsertUser({
    oauthType,
    accessToken,
    name,
    email,
    picture,
  });

  return user;
};

const verifyGithubToken = async (tempCode) => {
  const response = await axios.post(
    "https://github.com/login/oauth/access_token",
    {
      headers: { Accept: "application/json" },
      client_id: GITHUB_OAUTH_CLIENT_ID,
      client_secret: GITHUB_OAUTH_CLIENT_SECRET,
      code: tempCode,
    }
  );
  const queryStr = response.data;
  const accessToken = queryStr.split("=")[1].split("&")[0];
  return accessToken;
};

const loginWithGithub = async (oauthType, code) => {
  const accessToken = await verifyGithub({ oauthType, code });
  const response = await axios.get("https://api.github.com/user", {
    headers: {
      Authorization: `token ${accessToken}`,
      Accept: "application/vnd.github.v3+json",
    },
  });
  const user = await db.upsertUser(response);
  return user;
};

module.exports = { login, authorize };
