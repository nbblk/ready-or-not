const axios = require("axios");
const db = require("./mongo");
const { OAuth2Client } = require("google-auth-library");

const GOOGLE_OAUTH_CLIENT_ID = process.env.GOOGLE_OAUTH_CLIENT_ID;
const GITHUB_OAUTH_CLIENT_ID = process.env.GITHUB_OAUTH_CLIENT_ID;
const GITHUB_OAUTH_CLIENT_SECRET = process.env.GITHUB_OAUTH_CLIENT_SECRET;
const authClient = new OAuth2Client(GOOGLE_OAUTH_CLIENT_ID);

const login = async (oauthType, tokenData) => {
  let user;
  if (oauthType === "google") {
    user = await loginWithGoogle(oauthType, tokenData.tokenId);
  }
  if (oauthType === "github") {
    user = await loginWithGithub(oauthType, tokenData);
  }
  return user;
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
  const ticket = await authClient
    .verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_OAUTH_CLIENT_ID,
    })
    .catch(console.error);

  return ticket;
};

// More information: https://developers.google.com/identity/sign-in/web/backend-auth
const loginWithGoogle = async (oauthType, idToken) => {
  const ticket = await verifyGoogleToken(idToken);
  const { email, sub } = ticket.payload;
  const user = await db.upsertUser({
    oauthType,
    sub,
    email,
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
      code: tempCode.code,
    }
  );
  const queryStr = response.data;
  const accessToken = queryStr.split("=")[1].split("&")[0];
  return accessToken;
};

const loginWithGithub = async (oauthType, tempCode) => {
  const accessToken = await verifyGithubToken(tempCode);
  const response = await axios.get("https://api.github.com/user/emails", {
    headers: {
      Authorization: `token ${accessToken}`,
      Accept: "application/vnd.github.v3+json",
    },
  });
  let user = await db.upsertUser({
    email: response.data[0].email,
    oauthType: oauthType,
  });
  return user;
};

module.exports = { login, authorize };
