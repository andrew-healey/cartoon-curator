const express = require("express");

const router = express.Router();

const bodyParser = require("body-parser");

const moment = require("moment");

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: true
}));

router.post("/matchDate", (req, res) => {
    const {
        year,
        month,
        day,
        format,
        patterns
    } = req.body;
    const form = moment(`${year}/${month}/${day}`).format(format);
    let ret = null;
    for (let pattern in patterns) {
        const rx = new RegExp(pattern);
        if (form.match(rx)) {
            ret = form.replace(rx, patterns[pattern]);
            break;
        }
    }
    res.json({
        ans: ret,
    });
});

router.post("/btoa", (req, res) => res.json({
    ans: btoa(req.body.src)
}));
router.post("/atob", (req, res) => res.json({
    ans: atob(req.body.src)
}));

router.post("/match", (req, res) => {
    const {str,pattern}=req.body;
    const match=str.match(pattern);
    
    res.json(match&&{
        match:match[0],
        ...match.slice(1)
    });
});

module.exports = {
    router
};
