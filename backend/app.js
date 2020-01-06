module.exports = new Promise(async (resolve, reject) => {
    const express = require("express");
    const apiV1 = await require("./api/v1.js");

    const app = express();

    app.get("/", (req, res) =>
        res.send(`This API is under construction. See the 
<a href="">main website</a>
until this is finished.
`)
    );

    app.use("/api/v1", apiV1);

    resolve({
        app
    });
});
