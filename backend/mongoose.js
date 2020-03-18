require("dotenv").config();
const moment = require("moment");
const _ = require("lodash");
const {
    timerMaker
} = require("./util.js");
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

    const dbUrl = process.env.DATABASE.replace(/<password>/, process.env.PASSWORD).replace(/<division>/, process.env.DIVISION);
    mongoose.connect(dbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    const db = mongoose.connection;

    const {
        ObjectId
    } = mongoose.Schema.Types;

    let Comic, Series, Provider, Newspaper, comics, providers, series, newspapers;

    // Comics

    comics = new mongoose.Schema({
        date: {
            type: Date,
            required: true,
        },
        next: Date,
        previous: Date,
        seriesId: {
            type: ObjectId,
            required: true,
            ref: 'Series',
        },
        src: {
            type: String,
            required: true,
        },
        alt: String,
        description: String,
    });

    // Series

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
        description: String,
        provId: {
            type: ObjectId,
            required: true,
            ref: "Provider",
        },
    });

    series.statics.new = async function(seriesId, name, provider, description) {
        const series = new Series({
            seriesId,
            provId: provider.id,
            name,
            description,
        });
        await series.save();
        return series;
    };

    providers = new mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        description: String,
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
        descriptionJson: [{
            type: Object,
            required: true
        }],
    });

    // Providers

    providers.statics.new = async function(json, password) {
        const preExisting = await Provider.findOne({
            provId: json.id
        });
        //TODO Handle updating providers
        if (preExisting) {
            if (password && await bcrypt.compare(password, preExisting.password)) {
                const hasFound = Object.entries({
                    name: json.name,
                    dateJson: json["date-scrape"],
                    firstJson: json["extremes-scrape"].first || [],
                    lastJson: json["extremes-scrape"].last || [],
                    urlRx: json["src-to-url"],
                    nameJson: json["get-name"],
                    dateFormats: Object.values(json["date-formats"] || [json["date-format"] || "YYYY-MM-DD"]),
                    seriesIds: json["series-ids"] || [],
                    namesJson: json["list-names"],
                    description: json["description"],
                    descriptionJson: json["get-description"],
                }).reduce((last, [key, val]) => {
                    if (!_.isEqual(preExisting[key], val)) {
                        preExisting[key] = val;
                        return true;
                    }
                    return last;
                }, false);
                if (hasFound) {
                    await preExisting.save();
                    await preExisting.refresh();
                    return true;
                }
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
            description: json["description"],
            descriptionJson: json["get-description"],
        });
        await n.save();
        return true;
    };

    providers.methods.refresh = async function() {
        await Promise.all((await Series.find({
            provId: this.id
        })).map(async serie => //For each series, delete all of its comics and then it
            (await Comic.deleteMany({ //I fear Mongoose query thenables
                seriesId: serie.id
            })) &
            (await Series.findByIdAndDelete(serie.id))
        ));
    };

    providers.methods.getSeries = async function(seriesId) {
        let series = await Series.findOne({
            seriesId,
            provId: this.id,
        });
        console.log("sereis?",!!series);
        if (!series) {
            //Check if it is valid
            const name = await this.getName(seriesId);
            if (name) {
                //Create, save series
                series = await Series.new(seriesId, name, this);
                await series.save();
            }
        }
        return series;
    };

    providers.methods.getNames = async function() {
        //TODO Make this rerun every once in a while
        try {
            if (this.seriesIds == false) {
                const temp = Array.from((await runSteps(this.namesJson, {})).seriesIds);
                this.seriesIds = temp;
                await this.save();
            }
            return this.seriesIds;
        } catch (err) {
            return;
        }
    };

    const runSteps = async function(steps, vars, varsOnly = true) {
        try {
            return (ans => varsOnly ? ans.vars : ans)(await runEntireScraper({
                steps
            }, {
                vars
            }, extensions));
        } catch (err) {
            return {
                err
            };
        }
    }

    providers.methods.getDescription = async function(seriesId) {
        try {
            const series = await this.getSeries(seriesId);
            if (!series) throw new Error("Series does not exist.");
            if (!series.description) {
                series.description = (await runSteps(this.descriptionJson || [], {
                    seriesId
                }) || {}).description;
                await series.save();
            }
            return series.description;
        } catch (err) {
            return null;
        }
    };

    providers.methods.getFirst = async function(seriesId) {
        const firstDate = this.parseDate(((await runSteps(this.firstJson || [], {
            seriesId
        })) || {}).first);
        const first = firstDate && firstDate.toDate();
        return first;
    };

    providers.methods.getLast = async function(seriesId) {
        //if (!series.last || (new Date() - series.last >= 3.6 * 24 * 10 ** 6)) {
        const lastDate = this.parseDate((await runSteps(this.lastJson || [], {
            seriesId
        })).last);
        const last = lastDate && lastDate.toDate();
        return last;
    };

    providers.methods.getName = async function(seriesId, seriesExists = false) {
        return (await runSteps(this.nameJson, {
            seriesId
        })).name;
    };

    providers.methods.parseDate = function(str) {
        return str && moment(str, this.dateFormats).startOf('day');
    };

    providers.methods.getSeriesInfo = async function(seriesId) {
        const series = await getSeries(seriesId);
        const first = this.firstJson.length > 0 ? series.first || await this.getFirst(seriesId) : undefined;
        const last = this.lastJson.length > 0 ? (series.last&&new Date()-series.last>=process.env.RESET_LAST && series.last) || await this.getLast(seriesId) : undefined;
        const name = series.name || await this.getName(seriesId);
        const description = series.description || await this.getDescription(seriesId);
        const isChanged = first-series.first!=0||last-series.first!=0||name!==series.name||description!==series.description;
        if(isChanged){
            series.first=first;
            series.last=last;
            series.name=name;
            series.description=description;
            await series.save();
        }
        return {
            first,
            last,
            name,
            description,
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
            const timer = timerMaker();
            const series = await this.getSeries(seriesId);
            timer("getSeries");
            if (!series) return null;
            const date = Provider.genDate(year, month, day);
            timer("genDate");
            const startTime = new Date();
            let comic = await Comic.findOne({
                date,
                seriesId: series.id,
            });

            let prevDate = comic && moment(comic.previous);
            let nextDate = comic && moment(comic.next);

            let didWork = !!comic;

            if (!comic) {
                const {
                    src,
                    previous,
                    next,
                    alt,
                    description,
                    ...rest
                } = (await runSteps(this.dateJson, {
                    seriesId,
                    year,
                    month,
                    day
                }));
                timer("Entire runSteps");
                prevDate = this.parseDate(previous);
                nextDate = this.parseDate(next);
                if (!(src && date.isValid())) return {
                    info: rest
                };
                comic = new Comic({
                    previous: (prevDate && prevDate.isValid() && prevDate.toDate()) || undefined,
                    next: (nextDate && nextDate.isValid() && nextDate.toDate()) || undefined,
                    src,
                    date: date.toDate(),
                    seriesId: series.id,
                    alt,
                    description,
                });
                await comic.save();
                timer("Make/save comic");
                didWork = true;
            }
            if (didWork && recsLeft > 0)
                Promise.all([
                    [prevDate, -1],
                    [nextDate, 1]
                ].map(([dt, dir]) => dt && direction !== dir ? this.getComic(seriesId, dt.year(), dt.month() + 1, dt.date(), recsLeft - 1, dir) : null));
            timer("Just make the Promise");
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

    // Newspapers

    newspapers = new mongoose.Schema({
        seriesIds: [{
            type: ObjectId,
            ref: 'Series',
            required: true
        }],
        hashPassword: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        newsId: {
            type: String,
            required: true
        },
        // TODO
        // layout: [{/*Something...*/}]
    });

    newspapers.statics.new = async function(name, newsId, seriesInfo, password) {
        const preExisting = await Newspaper.findOne({
            newsId
        });
        const series = await Promise.all(seriesInfo.map(async info =>
            (await (await Provider.findOne({
                provId: info.provId
            })).getSeries(info.seriesId)),
        ));
        console.log(series);
        const seriesIds = series.filter(i => i).map(info => info._id);
        if (!preExisting) {
            const newspaper = new Newspaper({
                name,
                newsId,
                seriesIds,
                hashPassword: await bcrypt.hash(password, NUM_ROUNDS),
            });
            await newspaper.save();
            return true;
        }

        if (password && await bcrypt.compare(password, preExisting.hashPassword)) {
            const hasFound = Object.entries({
                name,
                seriesIds,
            }).reduce((last, [key, val]) => {
                if (!_.isEqual(preExisting[key], val)) {
                    preExisting[key] = val;
                    return true;
                }
                return last;
            }, false);
            if (hasFound) {
                await preExisting.save();
                return true;
            }
        }
        return false;

    };

    db.on("open", () => {
        Comic = mongoose.model("Comic", comics);
        Series = mongoose.model("Series", series);
        Provider = mongoose.model("Provider", providers);
        Newspaper = mongoose.model("Newspaper", newspapers);
        resolve({
            Comic,
            Provider,
            Series,
            Newspaper,
        });
    });
});
