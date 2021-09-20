require('dotenv').config()
const express = require("express");
const path = require("path");
const _ = require("lodash");
const jwt = require("jsonwebtoken");

const port = process.env.PORT || 8081;
const secret = process.env.SECRET;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log("/" + req.method, req.path);
  next();
});

app.get("/", (req, res, err) => {
  res.send("sms-gateway server");
});

app.post("/sms-gateway", (req, res, err) => {
 

  const token = req.headers.authorization || null;
  if (!token) {
    throw new Error("Authorization token is required");
  }
  console.log("Authorization Token : " + token);
  
  if (!secret) {
    console.log("Secret can not be found");
    throw new Error("Secret is not provided");
  }
  console.log("Secret : "+ secret);
  jwt.verify(token,secret,function(err,decoded){
      if(err){
          throw new Error("Error : "+ err)
      }
      console.log(decoded);
  })
  res.sendStatus(200);
});

app.listen(port, () => console.log(`server is running on ${port}`));
