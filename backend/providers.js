//Convert fs to use promises
const Promise = require("bluebird");
const fs = Promise.promisifyAll(require("fs"));
const request = require("request-promise");
const cheerio = require("cheerio");
const jsonframe = require("jsonframe-cheerio");
const {
    flatObject
} = require("../util");

const loadProviders = async (directory=__dirname,jsonRx = /^(.*)\.json$/,jsonStr="$1.json") => {
    let providers = {};
    const filenames = await fs.readdirAsync(directory + "/providers/");
    filenames.forEach(filename => {
        if (filename.match(jsonRx)) {
            const name = filename.replace(jsonRx, "$1");
            providers[name] = require(directory+`/providers/${name.replace(/(.*)/,jsonStr)}`);
        }
    });
    return providers;
};
//TODO Replace this class with the schema
class Provider {
    constructor(name, json) {
        this.name = name;
        this.dateJson = json["date-scrape"];
        this.firstJson = json["extremes-scrape"].first;
        this.lastJson = json["extremes-scrape"].last;
        this.idRxUrlJson = json["switch-image-id-and-url"];
    }
    async getDate(name,date) {
        return await Provider.scrapes(`${name}/${date}`, this.dateJson)
    }
    async getFirst(name){
        return await Provider.scrapes(name,this.firstJson);
    }
    async getLast(name){
        return await Provider.scrapes(name,this.lastJson);
    }
    static async scrapes(str, scrapes) {
        return await scrapes.reduce(async (last, next) => ({
            ...await last,
            ...await Provider.scrape(str, next, await last)
        }), {});
    }
    static async scrape(str, json, vars) {
        const url = str.replace(new RegExp(json["generate-url"].match), json["generate-url"].replace.replace(/\$\{([^}]+)\}/g, (_, key) => vars[key]))
        const html = await request(url);
        const $ = cheerio.load(html);
        jsonframe($);
        const res = flatObject($("body").scrape(json.frame));
        return Object.keys(res).reduce((last, next) => (next.startsWith("$") ? {
            ...last,
            [next.slice(1)]: res[next]
        } : last), vars);
    }
}

module.exports = {
    loadProviders,
    Provider
};