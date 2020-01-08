require("dotenv").config();
const moment = require("moment");
module.exports = new Promise(async (resolve, reject) => {
    const mongoose = require("mongoose");
    const {
        runEntireScraper,
        getString,
    } = require("@sesamestrong/json-scraper");

    const dbUrl = process.env.DATABASE.replace(/<password>/, process.env.PASSWORD);
    console.log(dbUrl);
    mongoose.connect(dbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    const db = mongoose.connection;

    const {
        ObjectId
    } = mongoose.Schema.Types;

    let Comic, Series, Provider, comics, providers, series;

    comics = new mongoose.Schema({
        date: {
            type: Date,
            required: true,
        },
        next: {
            type: Date,
        },
        previous: {
            type: Date,
        },
        seriesId: {
            type: ObjectId,
            required: true,
            ref: 'Series',
        },
        src: {
            type: String,
            required: true,
        },
    });

    series = new mongoose.Schema({
        name: {
            type: String,
            required: true,
        },
        seriesId: {
            type: String,
            required: true,
            unique: true
        },
        first: {
            type: Date,
        },
        last: {
            type: Date,
        },
        provId: {
            type: ObjectId,
            required: true,
            ref: "Provider",
        },
    });

    series.statics.new = async function(seriesId, name, provider) {
        const series = new Series({
            seriesId,
            provId: provider.id,
            name,
        });
        console.log("hey");
        await series.save();
        return series;
    };

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
            type: Object,
            required: true,
        },
        dateFormat: {
            type: String,
            required: false,
        },
    });

    providers.statics.new = async function(json) {
        const preExisting = await Provider.findOne({
            provId: json.id
        });
        //TODO Handle updating providers
        if (preExisting) return preExisting;
        const n = new this({
            name: json.name,
            provId: json.id,
            dateJson: json["date-scrape"],
            firstJson: json["extremes-scrape"].first,
            lastJson: json["extremes-scrape"].last,
            urlRx: json["src-to-url"],
            nameJson: json["get-name"],
            dateFormat: json["date-format"] || "YYYY-MM-DD",
        });
        await n.save();
        return n;
    };

    providers.methods.seriesDoesExist = async function(seriesId) {
        return await runSteps(this.getName).name !== undefined;
    };

    providers.methods.getSeries = async function(seriesId) {
        let series = await Series.findOne({
            seriesId,
            provId: this.id,
        });
        if (!series) {
            //Check if it is valid
            const name = await this.getName(seriesId);
            if (name) {
                //Create, save series
                series = await Series.new(seriesId, name, this);
            }
        }
        return series;
    };

    const runSteps = async function(steps, vars) {
        console.log(vars);
        return await runEntireScraper({
            steps
        }, vars);
    }

    providers.methods.getFirst = async function(seriesId) {
        const series = await this.getSeries(seriesId);
        if (!series) throw new Error("Series does not exist.");
        if (!series.first) series.first = this.parseDate((await runSteps(this.firstJson, {
            seriesId
        })).first).toDate();
        await series.save();
        return Provider.formatDate(series.first);
    };

    providers.methods.getLast = async function(seriesId) {
        const series = await this.getSeries(seriesId);
        if (!series) throw new Error("Series does not exist.");
        console.log("last", series, new Date() - series.last);
        if (!series.last || (new Date() - series.last >= 3.6 * 24 * 10 ** 6)) series.last = moment((await runSteps(this.lastJson, {
            seriesId
        })).last, "YYYY-MM-DD").toDate();
        await series.save();
        return Provider.formatDate(series.last);
    };

    providers.methods.getName = async function(seriesId) {
        return (await runSteps(this.nameJson, {
            seriesId
        })).name;
    };

    providers.methods.parseDate = function(str) {
        return str&&moment(str, this.dateFormat).startOf('day');
    };

    providers.methods.getSeriesInfo = async function(seriesId) {
        const first = await this.getFirst(seriesId);
        const last = await this.getLast(seriesId);
        console.log("On to name");
        const name = await this.getName(seriesId);
        return {
            first,
            last,
            name
        };
    };

    providers.statics.formatDate = function(date) {
        if (date instanceof Date) date = moment(date);
        return date&&date.format("YYYY/M/D");
    };

    providers.statics.genDate = (year, month, day) => {
        return moment(`${year}/${month}/${day}`, "YYYY-MM-DD");
    };

    providers.methods.getComic = async function(seriesId, year, month, day, recsLeft = 0) {
        const series = await this.getSeries(seriesId);
        const date = Provider.genDate(year, month, day);
        const startTime=new Date();
        const comic = await Comic.findOne({
            date,
            seriesId: series.id,
        });
        if(comic) console.log("Using cache for",seriesId,day,"taking",new Date()-startTime," ms");

        if (!comic) {
            const {
                src,
                previous,
                next
            } = (await runSteps(this.dateJson, {
                seriesId,
                year,
                month,
                day
            }));
            const prevDate = this.parseDate(previous);
            const nextDate = this.parseDate(next);

            if(!src) return {};
            const comic = new Comic({
                previous: prevDate&&prevDate.toDate(),
                next: nextDate&&nextDate.toDate(),
                src,
                date: date.toDate(),
                seriesId: series.id,
            });
            await comic.save();
            if(recsLeft>0)
                Promise.all([prevDate,nextDate].map(dt=>dt?this.getComic(seriesId,dt.year(),dt.month()+1,dt.date(),recsLeft-1):dt)).then(console.log("cached"));
            return {
                url: getString(this.urlRx, {
                    src: comic.src
                }),
                previous: Provider.formatDate(prevDate),
                next: Provider.formatDate(nextDate),
            };

        }
        return {
            url: getString(this.urlRx, {
                src: comic.src
            }),
            previous: Provider.formatDate(comic.previous),
            next: Provider.formatDate(comic.next),
        };
    };

    db.on("open", () => {
        Comic = mongoose.model("Comic", comics);
        Series = mongoose.model("Series", series);
        Provider = mongoose.model("Provider", providers);
        resolve({
            Comic,
            Provider
        });
    });
});
