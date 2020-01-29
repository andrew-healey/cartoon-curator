require("dotenv").config();
const moment = require("moment");
const bcrypt = require("bcrypt");
const {
    extensions
} = require("./extensions.js");
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
        dateFormats: [{
            type: String,
            required: true,
        }],
        password: {
            type: String,
            required: true,
        },
        namesJson: {
            type: Object,
        },
        seriesIds: [{
            type: String,
            required: true,
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
                    preExisting.dateFormats = Object.values(json["date-formats"] || [json["date-format"] || "YYYY-MM-DD"]);
                preExisting.seriesIds = json["series-ids"];
                preExisting.namesJson = json["list-names"];
                await preExisting.save();
                return true;
            }
            return false;
        }
        const n = new this({
            name: json.name,
            provId: json.id,
            dateJson: json["date-scrape"],
            firstJson: json["extremes-scrape"].first,
            lastJson: json["extremes-scrape"].last,
            urlRx: json["src-to-url"],
            nameJson: json["get-name"],
            dateFormats: Object.values(json["date-formats"] || [json["date-format"] || "YYYY-MM-DD"]),
            password: await bcrypt.hash(password, NUM_ROUNDS),
            namesJson: json["list-names"],
            seriesIds: json["series-ids"],
        });
        await n.save();
        return true;
    };

    providers.methods.refresh = async function() {
        Promise.all((await Series.find({
            provId: this.id
        })).map(async serie => //For each series, delete all of its comics and then it
            (await Comic.deleteMany({ //I fear Mongoose query thenables
                seriesId: serie.id
            })) &&
            (await Series.findByIdAndDelete(serie.id))
        ));
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

    providers.methods.getNames = async function() {
        //TODO Make this rerun every once in a while
        try {
            if (this.seriesIds == false) {
                const temp= Array.from((await runSteps(this.namesJson, {})).seriesIds);
                this.seriesIds = temp;
            }
            await this.save();
            return this.seriesIds;
        } catch (err) {
            return;
        }
    };

    const runSteps = async function(steps, vars) {
        return await runEntireScraper({
            steps
        }, vars, extensions);
    }

    providers.methods.getFirst = async function(seriesId) {
        try {
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
        } catch (err) {
            return null;
        }
    };

    providers.methods.getLast = async function(seriesId) {
        try {
            const series = await this.getSeries(seriesId);
            if (!series) throw new Error("Series does not exist.");
            if (!series.last || (new Date() - series.last >= 3.6 * 24 * 10 ** 6)) {
                const lastStr = (await runSteps(this.lastJson, {
                    seriesId
                })).last;
                if (!lastStr) return;
                series.last = this.parseDate(lastStr).toDate();
                await series.save();
            }
            return Provider.formatDate(series.last);
        } catch (err) {
            return null;
        }
    };

    providers.methods.getName = async function(seriesId) {
        return (await runSteps(this.nameJson, {
            seriesId
        })).name;
    };

    providers.methods.parseDate = function(str) {
        return str && moment(str, this.dateFormats).startOf('day');
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
        if (!date) return undefined;
        if (date instanceof Date) date = moment(date);
        return date && date.format("YYYY/M/D");
    };

    providers.statics.genDate = (year, month, day) => {
        return moment(`${year}/${month}/${day}`, "YYYY-MM-DD");
    };

    providers.methods.getComic = async function(seriesId, year, month, day, recsLeft = 0, direction = 0) {
        try {
            const series = await this.getSeries(seriesId);
            if (!series) return null;
            const date = Provider.genDate(year, month, day);
            const startTime = new Date();
            let comic = await Comic.findOne({
                date,
                seriesId: series.id,
            });

            let prevDate = comic && moment(comic.previous);
            let nextDate = comic && moment(comic.next);

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
                if (!(src && date.isValid())) return {};
                comic = new Comic({
                    previous: (prevDate && prevDate.isValid() && prevDate.toDate()) || undefined,
                    next: (nextDate && nextDate.isValid() && nextDate.toDate()) || undefined,
                    src,
                    date: date.toDate(),
                    seriesId: series.id,
                });
                await comic.save();
            }
            if (recsLeft > 0)
                Promise.all([
                    [prevDate, -1],
                    [nextDate, 1]
                ].map(([dt, dir]) => dt && direction !== dir ? this.getComic(seriesId, dt.year(), dt.month() + 1, dt.date(), recsLeft - 1, dir) : null));
            return {
                url: getString(this.urlRx, {
                    src: comic.src
                }),
                previous: Provider.formatDate(prevDate),
                next: Provider.formatDate(nextDate),
            };
        } catch (err) {
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
