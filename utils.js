const jwksClient = require("jwks-rsa");
var jwt = require("jsonwebtoken-tool");

const client = jwksClient({
  jwksUri: "https://tanver-custom.eu.auth0.com/.well-known/jwks.json",
  requestHeaders: {}, // Optional
  timeout: 30000, // Defaults to 30s
});

const publicKey = async () => {
  const kid = "nWtdsC1agQOSKHLa_pino";
  const key = await client.getSigningKey(kid);
  const signingKey = key.getPublicKey();
  return signingKey;
};

function getToken(req) {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    return req.headers.authorization.split(" ")[1];
  } else if (req.query && req.query.token) {
    return req.query.token;
  }
  return null;
}

function validateAPIKey(api_key) {
  // checking if API key is valid
  if (_isEqual(api_key, process.env.api_key)) {
    // chek if the token is reovked (optional)
    return true;
  }
  return false;
}

const validateToken = async (token) => {
  const key = await publicKey();
  if (key) {
    jwt.verify(token, key, { audience: "http://localhost:3000" }, (e, p) => {
      if (e) {
        return new Error(e);
      }
      return true;
    });
  }
};

module.exports = {
  getToken,
  validateAPIKey,
  publicKey,
  validateToken
};
