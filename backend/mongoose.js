require("dotenv").config();
const moment = require("moment");
const bcrypt = require("bcrypt");
const NUM_ROUNDS = 12;
module.exports = new Promise(async (resolve, reject) => {
    const mongoose = require("mongoose");
    const {
        runEntireScraper,
        getString,
    } = require("@sesamestrong/json-scraper");

    const dbUrl = process.env.DATABASE.replace(/<password>/, process.env.PASSWORD);
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
        password: {
            type: String,
            required: true,
        },
        namesJson: {
            type:Object,
        },
        seriesIds: [{
            type:String,
            required:true,
        }],
    });

    providers.statics.new = async function(json, password) {
        const preExisting = await Provider.findOne({
            provId: json.id
        });
        //TODO Handle updating providers
        if (preExisting) {
            if (password && await bcrypt.compare(password, preExisting.password)) {
                preExisting.name = json.name,
                    preExisting.provId = json.id,
                    preExisting.dateJson = json["date-scrape"],
                    preExisting.firstJson = json["extremes-scrape"].first,
                    preExisting.lastJson = json["extremes-scrape"].last,
                    preExisting.urlRx = json["src-to-url"],
                    preExisting.nameJson = json["get-name"],
                    preExisting.dateFormat = json["date-format"] || "YYYY-MM-DD";
                preExisting.seriesIds=json["series-ids"];
                preExisting.namesJson=json["list-names"];
                await preExisting.save();
            }
            return preExisting;
        }
        const n = new this({
            name: json.name,
            provId: json.id,
            dateJson: json["date-scrape"],
            firstJson: json["extremes-scrape"].first,
            lastJson: json["extremes-scrape"].last,
            urlRx: json["src-to-url"],
            nameJson: json["get-name"],
            dateFormat: json["date-format"] || "YYYY-MM-DD",
            password: await bcrypt.hash(password, NUM_ROUNDS),
            namesJson:json["list-names"],
            seriesIds: json["series-ids"],
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
            console.log("Making new series",seriesId);
            //Check if it is valid
            const name = await this.getName(seriesId);
            if (name) {
                //Create, save series
                series = await Series.new(seriesId, name, this);
            }
        }
        return series;
    };

    providers.methods.getNames = async function() {
        //TODO Make this rerun every once in a while
        this.seriesIds=this.seriesIds!=false?this.seriesIds:(await runSteps(this.namesJson,{})).seriesIds;
        await this.save();
        return this.seriesIds;
    };

    const runSteps = async function(steps, vars) {
        return await runEntireScraper({
            steps
        }, vars);
    }

    providers.methods.getFirst = async function(seriesId) {
        try{
        const series = await this.getSeries(seriesId);
        if (!series) throw new Error("Series does not exist.");
        if (!series.first) {
            const first = this.parseDate(((await runSteps(this.firstJson, {
                seriesId
            })) || {}).first);
            series.first = first && first.toDate();
        }
        await series.save();
        return Provider.formatDate(series.first);
        }catch(err) {return null;}
    };

    providers.methods.getLast = async function(seriesId) {
        try {
        const series = await this.getSeries(seriesId);
        if (!series) throw new Error("Series does not exist.");
        if (!series.last || (new Date() - series.last >= 3.6 * 24 * 10 ** 6)) {
            const lastStr=(await runSteps(this.lastJson, {
                seriesId
            })).last;
            if(!lastStr) return;
            series.last = this.parseDate(lastStr).toDate();
            await series.save();
        }
        return Provider.formatDate(series.last);
        }catch (err) { return null;}
    };

    providers.methods.getName = async function(seriesId) {
        return (await runSteps(this.nameJson, {
            seriesId
        })).name;
    };

    providers.methods.parseDate = function(str) {
        return str && moment(str, this.dateFormat).startOf('day');
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

    providers.statics.formatDate = function(date) {
        if (date instanceof Date) date = moment(date);
        return date && date.format("YYYY/M/D");
    };

    providers.statics.genDate = (year, month, day) => {
        return moment(`${year}/${month}/${day}`, "YYYY-MM-DD");
    };

    providers.methods.getComic = async function(seriesId, year, month, day, recsLeft = 0) {
        try{
        const series = await this.getSeries(seriesId);
        if (!series) return null;
        const date = Provider.genDate(year, month, day);
        const startTime = new Date();
        let comic = await Comic.findOne({
            date,
            seriesId: series.id,
        });

        let prevDate=comic&&moment(comic.previous);
        let nextDate=comic&&moment(comic.next);

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
            prevDate = this.parseDate(previous);
            nextDate = this.parseDate(next);

            if (!src) return {};
            comic = new Comic({
                previous: prevDate && prevDate.toDate(),
                next: nextDate && nextDate.toDate(),
                src,
                date: date.toDate(),
                seriesId: series.id,
            });
            await comic.save();
        }
            if (recsLeft > 0)
                Promise.all([prevDate, nextDate].map(dt => dt ? this.getComic(seriesId, dt.year(), dt.month() + 1, dt.date(), recsLeft - 1) : dt));
        return {
            url: getString(this.urlRx, {
                src: comic.src
            }),
            previous: Provider.formatDate(prevDate),
            next: Provider.formatDate(nextDate),
        };
        } catch(err) {
            console.error(err);
            return {};
        }
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
