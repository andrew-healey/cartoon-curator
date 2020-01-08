module.exports=new Promise(async (resolve, reject) => {
const express = require("express");
    const moment=require("moment");
const {
    Comic,
    //Series,
    Provider,
    //Scraper
} = await require("../mongoose.js");

const router = express.Router();

router.get("/:provider/:series", async (req, res) => {
    const provider = await Provider.findOne({
        provId: req.params.provider
    });
    res.send(await provider.getSeriesInfo(req.params.series));
});
router.get("/:providerId/:series/:year/:month/:day", async (req, res) => {
    const {providerId, series, year,month,day} = req.params;
    if(!(providerId&&series&&year&&month&&day)) return res.send({ok:false,message:"Not enough parameters."});
    const provider = await Provider.findOne({
        provId: providerId,
    });
    if(!provider) return res.send({ok:false,err:"Provider not found."});
    res.json(await provider.getComic(series, year, month, day,2));
});

Provider.new(require("../providers/gocomics.json")).then(i=>console.log("Made GoComics!"));
resolve(router);
});
