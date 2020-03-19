module.exports = new Promise(async (resolve, reject) => {
    const express = require("express");
    const apiV1 = await require("./api/v1.js");
    const apiV2 = await require("./api/v2.js");

    const app = express();

    app.use(require("cors")());

    app.get("/", (req, res) =>
        res.sendFile(__dirname+"/static/index.html")
    );

    app.use("/api/v1", apiV1);
    app.use("/api/v2", apiV2);

    resolve({
        app
    });
});
