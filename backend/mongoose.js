    require("dotenv").config();
module.exports = new Promise(async (resolve, reject) => {
    const mongoose = require("mongoose");
    const {
        runEntireScraper
    } = require("@sesamestrong/json-scraper");

    const dbUrl=process.env.DATABASE.replace(/<password>/, process.env.PASSWORD);
    mongoose.connect(dbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    const db = mongoose.connection;

    const {
        ObjectId
    } = mongoose.Schema.Types;

    let Comic, Series, Provider, Scraper, comics, providers, series, scrapers;

    comics = new mongoose.Schema({
        year: {
            type: Number,
            required: true
        },
        month: {
            type: Number,
            required: true
        },
        day: {
            type: Number,
            required: true
        },
        next: {
            type: Date,
        },
        previous: {
            type: Date
        }
    });

    series = new mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        id: {
            type: String,
            required: true,
            unique: true
        },
        comics: [{
            type: ObjectId,
            ref: comics,
            required: true
        }],
        first: {
            type: Date,
            required: true,
        },
        last: {
            type: Date,
            required: true,
        },
    });

    scrapers = new mongoose.Schema({
        steps: [{
            type: Object
        }],
    });

    providers = new mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        provId: {
            type: String,
            required: true,
            unique: true
        },
        series: [{
            type: Object,
            ref: series,
        }],
        dateJson: {
            type: Object,
            required: true,
        },
        firstJson: {
            type: Object,
            required: true,
        },
        lastJson: {
            type: Object,
            required: true,
        },
        urlRx: {
            type: String,
            required: true
        },
        nameJson: {
            type:Object,
            required:true,
        }
    });

    providers.statics.new = async function(json) {
        const n = new this({
            name: json.name,
            provId: json.id,
            dateJson: json["date-scrape"],
            firstJson: json["extremes-scrape"].first,
            lastJson: json["extremes-scrape"].last,
            urlRx: json["switch-image-id-and-url"],
            nameJson: json["get-name"],
        });
        await n.save();
        return n;
    };

    const runSteps= async function(steps,vars){
        return await runEntireScraper({steps},vars);
    }

    providers.methods.getFirst = async function(seriesId) {
        return (await runSteps(this.firstJson, {
            seriesId
        })).first;
    };

    providers.methods.getLast = async function(seriesId) {
        return (await runSteps(this.lastJson, {
            seriesId
        })).last;
    };

    providers.methods.getName = async function(seriesId) {
        return (await runSteps(this.nameJson, {
            seriesId
        })).name;
    };

    providers.methods.getSeriesInfo = async function(seriesId) {
        const first = await this.getFirst(seriesId);
        const last = await this.getLast(seriesId);
        const name = await this.getName(seriesId);
        return {
            first,
            last,
            name
        };
    };

    providers.methods.getComic = async function(seriesId, year, month, day) {
        console.log("getComic");
        return await runSteps(this.dateJson, {
            seriesId,
            year,
            month,
            day
        });
    };

    db.on("open", () => {
        Comic = mongoose.model("Comic",comics);
        //Series = mongoose.model("Series",series);
        Provider = mongoose.model("Provider",providers);
        //Scraper = mongoose.model("Scraper",scrapers);
        resolve({
            Comic,
            Provider
        });
    });
});
