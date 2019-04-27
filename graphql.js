const express_graphql = require('express-graphql');
const { buildSchema } = require('graphql');

const sources = require("./sources");

let allFunctions = require("./queryUrls");
const schema = buildSchema(`
type Query {
  getComics(id: String!,date: String!): [Comic]!
}

type ComicStrip {
  id: String!
  name: String
  first: Comic
  last: Comic
  syndicate: Syndicate!
}

type Comic {
  url: String
  previous: String
  date: String
  next: String
  strip: ComicStrip!
}

type Syndicate {
  name: Collection
  strips: [ComicStrip!]
}

enum Collection {
  GOCOMICS
  COMICSKINGDOM
  DILBERT
}
`);

function toDateObj(date) {
  let list = date.split("/");
  return { year: list[0], month: list[1], day: list[2] };
}

function toDateStr(path) {
  console.log("Converting",path);
  return path?path.replace(/\/[^\/]+\/(\d+)\/(\d+)\/(\d+)/g, "$1/$2/#3"):"";
}

function dateStrFromComponents({ year, month, day }) {
  return `${year}/${month}/${day}`;
}

function setComicFromJson(comic,json){
  comic.url=json.url;
  for(let order of ["previous","next"]){
    comic.setOrder(order,json[order]);
  }
  comic.setDate(dateStrFromComponents(json.year,json.month,json.day));
}

class Comic {
  constructor({ url, date, previous, next, strip }, numToCache = 5) {
    this.url = url;
    this.date = date;
    this.strip = strip;
    //strip.addDay(this);
    this.previous = previous;
    this.next = next;
    this.dateObj = toDateObj(date);
    console.log("Comic")
    //TODO init comic
    if(previous&&next) this.cacheNeighbors(numToCache);
  }
  cacheNeighbors(numToCache){
    if (numToCache-- > 0)
    for (let order of ["previous", "next"]) {
      this.strip.getComic(this[order]);
    }
  }
  setDate(dateStr){
    this.date=dateStr;
    this.dateObj=toDateObj(dateStr);
  }
}

class ComicStrip {
  /**
   * Just sets fields with an empty cache. Does not init first and last info if it is not given.
   */
  constructor({ id, name, first, last, syndicate }) {
    this.id = id;
    this.name = name;
    this.first = first;
    this.last = last;
    this.syndicate = syndicate;
    this.cache = [];
  }
  /**
   * Finds the first and last comic of the Strip from the Syndicate and sets its fields to them.
   */
  async extremeComics(){
    let extremesList=await this.syndicate.findDates(this);
    extremesList={first:extremesList[0],last:extremesList[1]};
    for (let order of ["first", "last"]) {
      let info=new Comic(extremesList[order]);
      this[order]=info;
    }
  }
  /**
   * Takes either a date (which it will convert into a Comic) or a Comic containing at least a date and uses the Syndicate to fill in the fields. Returns the Comic or modifies the Comic object passed.
   */
  async getComic(comic, numToCache) {
    if (typeof comic === "string") {
      comic = new Comic({ url: null, date: comic, previous: null, next: null, strip: this }, numToCache);
    }
    else {
      let matches = this.cache.filter(cached => cached.year === comic.year && cached.month === comic.month && cached.day === comic.day);
      if (matches.length === 1) return setComicFromJson(comic,matches[0]);
      if (matches.length > 1) throw `Redundancy in cache: The length of the cache for ${this.name} is ${matches.length}`;
    }
    let res = await this.syndicate.getComic(comic);
    setComicFromJson(comic,res);
    return comic;
  }
}

class Syndicate {
  /**
   * Initializes a Syndicate without initializing sources. Uses the source list from queryUrls.js and sources.js.
   */
  constructor({ name }) {
    if (Object.keys(sources).includes(name)) {
      this.sources = sources[name];
      this.strips = [];
      this.query=allFunctions[name.toLowerCase()];
    }
    else {
      throw "Invalid syndicate name.";
    }
  }
  /**
   * Set all the sources described in sources.js, making sure to init the first and last comic info in each with the extremeComics method.
   */
  async initSources() {//TODO actually get the first and last comic strip info, use it so there's no error
    this.strips = [];
    for (let comic of Object.keys(this.sources)) {
      let strip=new ComicStrip({ id: this.sources[comic], name: comic, syndicate: this });
      await strip.extremeComics();
    }
  }
  /**
   * Returns the raw JSON Object from sources.js or the cache.
   * @param comic {Comic} - The Comic object for which to
   */
  async getComic(comic) {

    if (comic.strip.syndicate == this) {
      console.log(comic.strip.id, comic.dateObj.year, comic.dateObj.month, comic.dateObj.day);
      let info = await this.query.getDate(comic.strip.id, comic.dateObj.year, comic.dateObj.month, comic.dateObj.day);
      console.log(`Retrieved ${comic.strip.id}/${comic.date}`);
      return info;
    }
    throw "Mismatched Syndicate.";
  }
  /**
   * Returns the strip from the list.
   */
  async getStrip(id) {
    let strip = this.strips.filter(i=>i.id==id)[0];
    return strip;
  }
  async findDates(strip){
    //Get dates and assign them to Comics
    let stripExtremes=await this.query.getExtremes(strip.id);
    //Fill in the necessary data for those Comics
    let next=[];
    for(let extreme of stripExtremes) {
      next.push(new Comic({id:strip.id,date:dateStringFromComponents(extreme.year,extreme.month,extreme.day),next:toDateStr(extreme.next),previous:toDateStr(extreme.prevous),strip:this}));
    }
    return next;
  }
}
let comics;
(async () => {

  let gocomics = await new Syndicate({ name: "gocomics" });
  await gocomics.initSources();
  let pbs = await gocomics.getStrip("pearlsbeforeswine");
  console.log("pbs has",Object.keys(pbs));
  comics = [await pbs.getComic("2019/04/12")]/*[
  {
    url: ()=>"https://assets.amuniversal.com/4a034c302bb501378ae6005056a9545d",
    date:"2019/04/15",
    previous:"2019/04/14",
    next:"",
    strip:{
      id:"dilbert-classics",
      name:"Dilbert Classics",
      first:"",
      last:"",
      syndicate:{
        name:"GOCOMICS",
        strips:[]
      }
    }
  }
]*/;




})();

const root = {
  getComics: ({ id, date }) => comics.filter(i => i.strip.id === id && i.date === date),
  getStrips: ({ id, name }) => strips.filter(i => i.id === id || i.name === name)
};

module.exports = express_graphql({
  rootValue: root,
  schema,
  graphiql: true
});