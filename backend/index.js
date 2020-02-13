(async () => {
    const {
        app
    } = await require("./app");

    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`Server started, listening on port ${port}`));

    const {
        Provider
    } = await require("./mongoose.js");
    const {
        loadProviders
    } = require("./providers");

    const providers = await loadProviders();
    await Promise.all(providers.map(provider => Provider.new(provider, process.env.STD_PASSWORD)));

})();
