const saltshaker = require("randomstring").generate;
const {
    timerMaker
} = require("@sesamestrong/timer");
module.exports = new Promise(async (resolve, reject) => {
    const express = require("express");
    const moment = require("moment");
    const {
        Comic,
        Series,
        Provider,
        Newspaper,
    } = await require("../mongoose.js");

    const router = express.Router();

    const bodyParser = require("body-parser");

    router.use(bodyParser.json());
    router.use(bodyParser.urlencoded({
        extended: true
    }));

    router.get("/series/:provider/:series", async (req, res) => {
        const provider = await Provider.findOne({
            provId: req.params.provider
        });
        if (!provider) return res.status(404).end();
        const seriesInfo = await provider.getSeriesInfo(req.params.series);
        res.json({
            name: seriesInfo.name,
            last: seriesInfo.last,
            first: seriesInfo.first,
            description: seriesInfo.description,
        });
    });
    router.get("/comic/:providerId/:series/:year/:month/:day", async (req, res) => {
        const {
            providerId,
            series,
            year,
            month,
            day
        } = req.params;
        const breh = timerMaker();
        if (!(providerId && series && year && month && day)) return res.status(404).end()
        const provider = await Provider.findOne({
            provId: providerId,
        });
        const provLookup = new Date();
        breh("Provider lookup");
        if (!provider) return res.status(404).end();
        res.json(await provider.getComic(series, year, month, day, 1));
        breh("Full getComic");
    });

    router.get("/provider", async (req, res) => {
        res.json((await Promise.all((await Provider.find()).map(async provider => ({
            [provider.provId]: await provider.getNames()
        })))).reduce((last, next) => ({
            ...last,
            ...next
        }), {}));
    });

    router.post("/provider", async (req, res) => {
        const {
            password = `${saltshaker(64)}`, json
        } = req.body;
        if (!json || !json.id) return res.status(400).end();;
        if (json.id == "provider") return res.status(400).end();
        res.json({
            saved: (await Provider.new(json, password)),
            password
        });
    });

    router.get("/provider/:provider", async (req, res) => {
        const {
            provider: provId
        } = req.params;
        const toGet = await Provider.findOne({
            provId
        });
        if (!toGet) return res.json({
            ok: false
        });
        return res.json({
            "series-ids": toGet.seriesIds,
            "date-scrape": toGet.dateJson,
            "extremes-scrape": {
                "first": toGet.firstJson,
                "last": toGet.lastJson,
            },
            "get-name": toGet.nameJson,
            "date-formats": toGet.dateFormats,
            "list-names": toGet.namesJson,
            "src-to-url": toGet.urlRx,
            "id": toGet.provId,
            "name": toGet.name,
            "description": toGet.description,
            "get-description": toGet.descriptionJson,
        });
    });

    router.get("/newspaper", async (req, res) => {
        const newspapers = await Newspaper.find();
        return res.json(newspapers.map(i => i.newsId));
    });

    router.get("/newspaper/:newsId", async (req, res) => {
        const {
            newsId
        } = req.params;
        if (!newsId) return res.json({
            ok: false,
            error: "newsId must be specified"
        });
        const toGet = await Newspaper.findOne({
            newsId: newsId
        });
        if (!toGet) return res.json({
            ok: false,
            error: "newsId does not refer to any newspaper"
        });
        return res.json({
            name: toGet.name,
            newsId: toGet.newsId,
            series: await Promise.all(toGet.seriesInfo.map(async ({
                seriesId,
                x,
                y
            }) => ({
                seriesId: (async series => ({
                    seriesId: series.seriesId,
                    provId: (await Provider.findById(series.provId)).provId
                }))(await Series.findById(seriesId)),
                x,
                y
            }))),
        });
    });

    router.post("/newspaper", async (req, res) => {
        const {
            newsId,
            password = saltshaker(),
            seriesInfo,
            name,
        } = req.body;
        if (!(newsId && seriesInfo && name)) return res.json({
            ok: false,
            error: "Missing information."
        });
        const seriesThings = Object.keys(seriesInfo).reduce((last, next) => ([
            ...last,
            ...seriesInfo[next].map(({
                seriesId,
                xPercent,
                yPercent
            }) => ({
                provId: next,
                seriesId,
                x,
                y,
            }))
        ]), []);
        return res.json({
            status: (await Newspaper.new(name, newsId, seriesThings, password)),
            password
        });
    });

    resolve(router);
});