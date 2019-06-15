const express = require("express");
const exphbs = require('express-handlebars');
const db = require("./db");
const app = express();
//https://comic-strip-api--426729.repl.co/pearlsbeforeswine/2016/01/01
const allSources = require("./sources");
const infoFinders = require("./queryUrls");
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
let SUPPORTED_STRIPS = {};
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/welcome.html");
    // console.log(req.get("user-agent").includes("Kindle"));
});
let comics = {};
//Shape {url:{imgHash,prevUrl,nextUrl}}
(async () => {
    comics = await db.cachedComics();
})();

async function genComic(id, year, month, day) {
    let doPad = i => i.toString().padStart(2, "0");
    day = doPad(day);
    month = doPad(month);
    year = year.toString();
    let path = `/${id}/${year}/${month}/${day}`;
    if (Object.keys(comics).includes(path)) {
        // console.log("Was cached",id,day,comics[path].url);
    } else {
        let foundMatch = false;
        for (server of Object.keys(allSources)) {
            let supported = allSources[server];
            // console.log(server,supported["Sherman's Lagoon"],id,Object.values(supported).includes(id));
            if (Object.values(supported).includes(id)) {
                // console.log("\n\n\nSUPPORTED\n\n\n");
                let ret = infoFinders[server].getDate(id, year, month, day);
                comics[path] = ret;
                return ret;
            } else if (Object.keys(supported).includes(id)) {
                let ret = infoFinders[server](supported[id], year, month, day);
                comics[path] = ret;
                return ret;
            }
        }
        // console.log("Nothing found: "+path,Object.keys(comics));
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
                // console.log(nextInfo[direction]);
                nextInfo = await genComic(info.id, next[2], next[3], next[4]);
            } catch (err) {
                // console.log(err);
            }
        }
    }
}

app.get("/:id/:year/:month/:day", async (req, res) => {
    const year = parseInt(req.params.year);
    const month = parseInt(req.params.month);
    const day = parseInt(req.params.day);
    let info = await genComic(req.params.id, year, month, day);
    // console.log("Info =",info);
    let url = info.url;
    let doRotation = req.get("user-agent").includes("Kindle")||req.query.rot==="true"?"rot":"not";
    res.render("img", { ...info,
        doRotation
    });
    findSurrounding(info);
});
app.get("/api/:id/:year/:month/:day", async (req, res) => {
    const year = parseInt(req.params.year);
    const month = parseInt(req.params.month);
    const day = parseInt(req.params.day);
    // console.log(day,req.params.id);
    let info = await genComic(req.params.id, year, month, day);
    // console.log(info?"Info is real":"Info is not real");
    // console.log(info.error);
    let url = info.url;
    res.send({ ...info,
        url
    });
    findSurrounding(info);
});
app.get("/ids", async (req, res) => {
    res.send(allSources);
});
// app.use("/test/graphql",require("./graphql"));
app.listen(process.env.PORT, () => console.log("Server started"));
