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

module.exports = {
  getToken,
  validateAPIKey,
};
