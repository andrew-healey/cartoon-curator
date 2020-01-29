const saltshaker = require("randomstring").generate;
module.exports = new Promise(async (resolve, reject) => {
    const express = require("express");
    const moment = require("moment");
    const {
        Comic,
        //Series,
        Provider,
        //Scraper
    } = await require("../mongoose.js");

    const router = express.Router();

    const bodyParser = require("body-parser");

    router.use(bodyParser.json());
    router.use(bodyParser.urlencoded({
        extended: true
    }));

    router.get("/:provider/:series", async (req, res) => {
        const provider = await Provider.findOne({
            provId: req.params.provider
        });
        if (!provider) res.status(404);
        res.send(await provider.getSeriesInfo(req.params.series));
    });
    router.get("/:providerId/:series/:year/:month/:day", async (req, res) => {
        const {
            providerId,
            series,
            year,
            month,
            day
        } = req.params;
        if (!(providerId && series && year && month && day)) return res.send({
            ok: false,
            message: "Not enough parameters."
        });
        const provider = await Provider.findOne({
            provId: providerId,
        });
        if (!provider) return res.send({
            ok: false,
            err: "Provider not found."
        });
        res.json(await provider.getComic(series, year, month, day, 2));
    });

    router.get("/ids", async (req, res) => {
        res.json((await Promise.all((await Provider.find()).map(async provider => console.log(provider.provId)||({
            [provider.provId]: await provider.getNames()
        })))).reduce((last, next) => ({ ...last,
            ...next
        }), {}));
    });

    router.post("/provider", async (req, res) => {
        const {
            password = `${saltshaker(64)}`, json
        } = req.body;
        res.json({
            provider: { ...(await Provider.new(json, password)),
                password: undefined
            },
            password
        });
    });


    //Provider.new(require("../providers/gocomics.json"), "Test_PW").then(i => console.log("Made GoComics!"));
    resolve(router);
});
