const Promise = require("bluebird");
const fs = Promise.promisifyAll(require("fs"));

const loadProviders = async (directory = __dirname, jsonRx = /^(.*)\.json$/, jsonStr = "$1.json") => {
    let providers = [];
    const filenames = await fs.readdirAsync(directory + "/providers/");
    filenames.forEach(filename => {
        if (filename.match(jsonRx)) {
            const name = filename.replace(jsonRx, "$1");
            providers.push(require(directory + `/providers/${name.replace(/(.*)/,jsonStr)}`));
        }
    });
    return providers;
};

module.exports = {
    loadProviders
};