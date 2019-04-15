const express = require("express");
const exphbs = require('express-handlebars');
const db = require("./db");
const app = express();
const moment=require("moment");

//https://comic-strip-api--426729.repl.co/pearlsbeforeswine/2016/01/01
let allSources=require("./sources");
app.engine('.hbs', exphbs({
  extname: '.hbs'
}));
app.set('view engine', '.hbs');
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const bodyParser = require("body-parser");
const request = require("request-promise");
const cheerio = require("cheerio");
let SUPPORTED_STRIPS={};
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/welcome.html");
  console.log(req.get("user-agent").includes("Kindle"));
});
let comics = {};
//Shape {url:{imgHash,prevUrl,nextUrl}}
(async () => {
  comics = await db.cachedComics();
})();

let infoFinders={
  dilbert:async (id, year, month, day)=>{
    let date=`${year}-${month}-${day}`;
    let url=`https://dilbert.com/strip/${date}`;
    let html=await request(url);
    let $=cheerio.load(html);
    let img=$("meta[property='og:image']");
    let previous=$("i.fa.fa-caret-left");
    let next=$("i.fa.fa-caret-right");
    if(!img) return {error:true};
    let hash=img.attr("content").replace(/^.+(.{32})$/,"$1");
    let changeDate=i=>i?i.replace(/^.+\/(\d+)-(\d+)-(\d+)$/g,"/"+id+"/$1/$2/$3"):"";
    let ret={url:`https://assets.amuniversal.com/${hash}`,hash,previous:changeDate(previous.parent().attr("href")),next:changeDate(next.parent().attr("href")),id,year,month,day,first:"",last:""};
    return ret;
  },

  gocomics:async (id, year, month, day)=>{
  let path=`${id}/${year}/${month}/${day}`;
  let url = `https://www.gocomics.com/${path}`;
  let html = await request(url);
  let $ = cheerio.load(html);
  let err = $("div.alert.alert-dismissible.fade.show.gc-alert.gc-alert--warning.js-gc-alert");
  let image = $("meta[property='og:image']");
  let previous = $("a.fa.btn.btn-outline-secondary.btn-circle.fa-caret-left.sm.js-previous-comic");
  let next = $("a.fa.btn.btn-outline-secondary.btn-circle.fa-caret-right.sm");
  let first = $("a.fa.btn.btn-outline-secondary.btn-circle.fa.fa-backward.sm");
  let last = $("a.fa.btn.btn-outline-secondary.btn-circle.fa-forward.sm");
  let hash=image.attr("content");
  if (!image||!hash){
    return {error: true};
  }
  hash=hash.substr(31);
  let ret={
    previous: previous.attr("href"),
    next: next.attr("href"),
    first: first.attr("href"),
    last: last.attr("href"),
    url: `https://assets.amuniversal.com/${hash}`,
    hash,
    id,
    year,
    month,
    day
  };
  return ret;
  },

  comicskingdom:async (url, year, month, day)=>{
    month=moment(month).format("MMMM");
    console.log("hmm",month);
    day=parseInt(day).toString();
    let date=`${month}-${day}-${year}`;
    let reqUrl=`http://${url}/comics/${date}`;
    let html=await request(reqUrl);
    let $=cheerio.load(html);
    let img=$("article div p img");
    let next=$("li#nextcomic a[rel='next']");
    let first=$("li#firstcomic a");
    let last=$("li#lastcomic a");
    let previous=$("li#previouscomic a[rel='prev']");
    let getPath=i=>i&&i.attr("href")?`/${url}/${moment(i.attr("href").replace(/^.+([a-zA-Z]+)-(\d)+-(\d)+$/g,`$1-$2-$3`)).format("YYYY/MM/DD")}`:undefined;
    let ret={
      url:img.attr("src"),next:getPath(next),first:getPath(first),last:getPath(last),previous:getPath(previous),id:url,year,month,day
    };
    return ret;
  }
};

async function genComic(id, year, month, day) {
  let doPad = i => i.toString().padStart(2, "0");
  day = doPad(day);
  month = doPad(month);
  year = year.toString();
  let path = `/${id}/${year}/${month}/${day}`;
  if (Object.keys(comics).includes(path)) {
    console.log("Was cached",id,day);
  }
  else {
    let foundMatch=false;
    for(server of Object.keys(allSources)){
      let supported=allSources[server];
      if(Object.values(supported).includes(id)){
        let ret=infoFinders[server](id,year,month,day);
        comics[path]=ret;
        return ret;
      }
      else if(Object.keys(supported).includes(id)){
        let ret=infoFinders[server](supported[id],year,month,day);
        comics[path]=ret;
        return ret;
      }
    }
    console.log("Nothing found: "+path,Object.keys(comics));
  }
  return comics[path];
}

async function findSurrounding(info) {
  //Future
  let nextInfo = info;
  for (direction of ["next", "previous"]) {
    for (let i = 0; i < 5; i++) {
      if (!nextInfo[direction]) break;
      let next = nextInfo[direction].split("/");
      try {
        console.log(nextInfo[direction]);
        nextInfo = await genComic(info.id, next[2], next[3], next[4]);
      } catch (err) {
        console.log(err);
      }
    }
  }
}

app.get("/:id/:year/:month/:day", async (req, res) => {
  const year = parseInt(req.params.year);
  const month = parseInt(req.params.month);
  const day = parseInt(req.params.day);
  let info = await genComic(req.params.id, year, month, day);
  console.log("Info =",info);
  let url = info.url;
  let doRotation=req.get("user-agent").includes("Kindle")?"rot":"not";
  res.render("img", {...info,doRotation});
  findSurrounding(info);
});
app.get("/api/:id/:year/:month/:day",async (req,res)=>{
  const year = parseInt(req.params.year);
  const month = parseInt(req.params.month);
  const day = parseInt(req.params.day);
  console.log(day,req.params.id);
  let info = await genComic(req.params.id, year, month, day);
  console.log(info?"Info is real":"Info is not real");
  console.log(info.error);
  let url = info.url;
  res.send({...info,url});
  findSurrounding(info);
});
app.get("/ids", async (req, res) => {
  res.send(allSources);
});
app.listen(3000, () => console.log("Server started"));