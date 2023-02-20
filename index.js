require("dotenv").config();
const express = require("express");
const path = require("path");
const _ = require("lodash");
var jwt = require("jsonwebtoken-tool");
const querystring = require("querystring");
const urlParser = require("url");

const {
  getToken,
  validateAPIKey,
  publicKey,
  validateToken,
} = require("./utils");
const port = process.env.PORT || 8081;
const secret = process.env.SECRET;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log("/" + req.method, req.path);
  next();
});

app.get("/test_http", (req, res, err) => {
  console.log("Headers : " + JSON.stringify(req.headers));
  console.log("Body : " + JSON.stringify(req.body));
  const user = {
    name: "abcd",
    age: 20,
    kyc: true,
    phone: "07832953525",
  };
  res.status(200).send(user);
});

app.post("/webhook", (req, res, err) => {
  console.log("Headers : " + JSON.stringify(req.headers));
  console.log("Body : " + JSON.stringify(req.body));
  res.sendStatus(200);
});

app.get("/proxy", (req, res, err) => {
  console.log("Headers : " + JSON.stringify(req.headers));
  console.log("Body : " + JSON.stringify(req.body));

  const parsedUrl = urlParser.parse(req.url, true).query;
  console.log(parsedUrl);
  const appUrl = parsedUrl.destination_url;
  const state = parsedUrl.state;
  const code = parsedUrl.code;
  const url = `${appUrl}?code=${code}&state=${state}`;
  console.log(url);
  res.redirect(url);
});

app.post("/okta-eventhook", (req, res, err) => {
  console.log("Headers : " + JSON.stringify(req.headers));
  console.log("Body : " + JSON.stringify(req.body));

  const api_key = req.headers.authorization || "";
  // checking api key is not null
  if (!api_key) {
    res.sendStatus(401);
  }
  const validation = validateAPIKey(api_key);
  if (validation) {
    // execte business logic

    res.sendStatus(200);
  }
});
app.post("/api/healthcheck", async (req, res, next) => {
  const token = getToken(req);
  if (!token) {
    res.sendStatus(401);
  }

  await publicKey().then((key) => {
    console.log(key);
    jwt.verify(token, key, (e, p) => {
      if (e) {
        console.log(e);
        res.status(401);
        return;
      }
      // console.log(p);
      res.status(200).send("You did it");
    });
  });
});

app.post("/sms-gateway", (req, res, err) => {
  console.log("Headers : " + JSON.stringify(req.headers));
  console.log("Body : " + JSON.stringify(req.body));

  const token = getToken(req);

  if (!token) {
    throw new Error("Authorization token is required");
  }
  console.log("Authorization Token : " + token);

  if (!secret) {
    throw new Error("Secret is not provided");
  }
  console.log("Secret : " + secret);

  jwt.verify(token, secret, function (err, decoded) {
    if (err) {
      throw new Error("Error : " + err);
    }
    console.log(JSON.stringify(decoded));
  });
  console.log("Request Body ========= \n");
  console.log(JSON.stringify(req.body));
  res.sendStatus(200);
});

(async () => {
  app.listen(port, () => console.log(`server is running on ${port}`));
})();
