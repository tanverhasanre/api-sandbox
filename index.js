const express = require("express");
const path = require("path");
const _ = require("lodash");

const port = process.env.PORT || 8081;

const app = express();
app.use(express.json()); 
app.use(express.urlencoded({extended: true})); 


app.use((req, res, next) => {
  console.log("/" + req.method, req.path);
  console.log("Authorization Token" +req.headers.authorization);
  next();
});

app.get("/", (req, res, err) => {
    res.send("sms-gateway server");
});

app.post("/sms-gateway", (req, res, err) => {
  console.log(req.body);
  res.sendStatus(200);
});

app.listen(port, () => console.log(`server is running on ${port}`));
