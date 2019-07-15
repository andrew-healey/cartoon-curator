const {
    loadProviders,
    Provider
} = require("../../backend/providers.js");
const assert = require("assert");
describe("Working provider management", () => {
    let providers;
    // eslint-disable-next-line no-undef
    it("Retrieves providers in JSON format", async () => {
        providers = await loadProviders();
        assert.equal(typeof providers, "object");
    });
});
describe("Provider class", function () {
    this.timeout(5000);
    it("Extracts variables from a JSONFrame scrape", async () =>
        assert.deepEqual({
            "slash-url": "https://github.githubassets.com/images/search-key-slash.svg"
        }, await Provider.scrape("https://github.com/", {
            "generate-url": {
                "match": "",
                "replace": ""
            },
            frame: {
                "$slash-url": ".mr-2.header-search-key-slash @ src"
            }
        })));
    it("Follows multi-step JSONFrame scrapes", async function () {
        assert.deepEqual({
                "login-link": "/login",
                "main-header": "Sign in to GitHub"
            },
            await Provider.scrapes("https://github.com", [{
                    "generate-url": {
                        "match": "",
                        "replace": ""
                    },
                    frame: {
                        "$login-link": "a.HeaderMenu-link.no-underline.mr-3 @ href"
                    }
                },
                {
                    "generate-url": {
                        "match": "$",
                        // eslint-disable-next-line no-template-curly-in-string
                        "replace": "${login-link}"
                    },
                    frame: {
                        "$main-header": "h1"
                    }
                }
            ])
        );
    });
});