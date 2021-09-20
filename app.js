const jwt = require("jsonwebtoken");


var token="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2MzIxNDczOTksImF1ZCI6InVybjpNeVNtc0dhdGV3YXkiLCJpc3MiOiJBdXRoMCIsInN1YiI6InVybjpBdXRoMCJ9.MdeA6VgWuTCaEeNM8ag1LVIvNn_0NhXegR5wP_CMaI0";
var secret="41f0f847a3b6bc5b78eb4171cbad85c5869f1541aa04f65fe6800267fb3ac5d"

jwt.verify(token,secret,function(err,decoded){
    if(err){
        throw new Error(err)
    }
    console.log(decoded)
})