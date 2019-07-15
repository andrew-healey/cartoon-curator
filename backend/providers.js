//Convert fs to use promises
const Promise = require("bluebird");
const fs = Promise.promisifyAll(require("fs"));
const request=require("request-promise");
const cheerio=require("cheerio");
const jsonframe=require("jsonframe-cheerio");
const {flatObject}=require("../util");
const jsonRx = /^(.*)\.json$/; //Match any file with a JSON file extension
const rx = "$1"; //Get just JSON file extension - for example, gocomics.json -> gocomics

const loadProviders = async () => {
    let providers = {};
    console.log(__dirname);
    const filenames = await fs.readdirAsync(__dirname + "/providers/");
    filenames.forEach(filename => {
        if (filename.match(jsonRx)) {
            const name = filename.replace(jsonRx, rx);
            providers[name] = require(`./providers/${name}.json`);
        }
    });
    return providers;
};

class Provider {
    constructor(name, json) {
        this.name=name;
        this.dateJson=json["date-scrape"];
        this.firstJson=json["extremes-scrape"].first;
        this.lastJson=json["extremes-scrape"].last;
        this.idRxUrlJson=json["switch-image-id-and-url"];
    }
    async getDate(date){
        return await Provider.scrapes(`${this.name}/${date}`,this.dateJson)
    }
    static async scrapes(str, scrapes) {
        return await scrapes.reduce(async (last, next) => ({
            ...await last,
            ...await Provider.scrape(str, next, await last)
        }), {});
    }
    static async scrape(str, json, vars) {
        const url = str.replace(new RegExp(json["generate-url"].match), json["generate-url"].replace.replace(/\$\{([^}]+)\}/g, (_, key) => vars[key]))
        const html=await request(url);
        const $=cheerio.load(html);
        jsonframe($);
        const res=flatObject($("body").scrape(json.frame));
        return Object.keys(res).reduce((last,next)=>(next.startsWith("$")?{...last,[next.slice(1)]:res[next]}:last),vars);
    }
}

module.exports = {
    loadProviders,
    Provider
};