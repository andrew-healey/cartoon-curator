const {
    Schema
} = require("mongoose");
const ObjectId=Schema.Types.ObjectId;
const request = require("request-promise");
const cheerio = require("cheerio");
const jsonframe = require("jsonframe");
const {
    flatObject
} = require("../../utils");
const providers = new Schema({
    id: {
        type: String,
        required: [true, "Provider ID is required"]
    },
    name: {
        type: String,
    },
});

providers.statics.construct = async function (name, json) {
    let provider;
    const existents = await this.find(name);
    if (existents.length>0) {
        provider=existents[0];
    } else {
        provider = new this({
            name
        });
    }
    provider.dateJson = json["date-scrape"];
    provider.firstJson = json["extremes-scrape"].first;
    provider.lastJson = json["extremes-scrape"].last;
    provider.idRxUrlJson = json["switch-image-id-and-url"];
    let comicNames = json.comics;
    provider.loadComics(comicNames);
    return {
        provider
    };
};
providers.statics.scrape = async function (str, json, vars) {
    const url = str.replace(new RegExp(json["generate-url"].match), json["generate-url"].replace.replace(/\$\{([^}]+)\}/g, (_, key) => vars[key]))
    const html = await request(url);
    const $ = cheerio.load(html);
    jsonframe($);
    const res = flatObject($("body").scrape(json.frame));
    return Object.keys(res).reduce((last, next) => (next.startsWith("$") ? {
        ...last,
        [next.slice(1)]: res[next]
    } : last), vars);
};
providers.statics.scrapes = async function (str, scrapes) {
    return await scrapes.reduce(async (last, next) => ({
        ...await last,
        ...await this.scrape(str, next, await last)
    }), {});
};
providers.methods.getDate = async function (name, date) {
    return await this.scrapes(`${name}/${date}`, this.dateJson)
};
providers.methods.getFirst = async function (name) {
    return await this.scrapes(name, this.firstJson);
};
providers.methods.getLast = async function (name) {
    return await this.scrapes(name, this.lastJson);
};
providers.methods.loadComics=async function (comicNames){
    // const existentComics=
}

const loadDependencies = () => {
};

module.exports = {
    schema:providers,
    loadDependencies,
    modelName: 'Provider'
};