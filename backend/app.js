const express=require("express");
const graphql=require("../graphql");

const app=express();

app.get("/",(req,res)=>
    res.send(`This API is under construction. See the 
<a href="">main website</a>
until this is finished.
`)
);

app.use("/api",graphql);

module.exports={app};