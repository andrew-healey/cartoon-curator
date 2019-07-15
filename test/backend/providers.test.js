const {
    loadProviders,
    Provider
} = require("../../backend/providers.js");
const assert = require("assert");
const {contains}=require("../../util");
let providers;
describe("Working provider management", () => {
    // eslint-disable-next-line no-undef
    it("Retrieves providers in JSON format", async () => {
        providers = loadProviders();
        providers = await providers;
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

describe("Providers", function () {
    let providerInstances = [],
        providerAnswers={};
    before("Load providers", async () => {
        const provObj = await providers;
        providerInstances = Object.keys(provObj).map(provName => new Provider(provName, provObj[provName]));
        providerAnswers = await loadProviders(__dirname,/^(.*)\.test\.json$/,"$1.test.json");
    });
    it("Provider validation", function () {
        providerInstances.forEach((prov) =>
            describe(prov.name, () => {
                const answers = providerAnswers[prov.name];
                it("Gets first comic strip", async function () {
                    const extInfo = answers["extremes-scrape"].first;
                    contains(
                        extInfo.out, await prov.getFirst(extInfo.in),true
                    );
                });
                it("Gets comic strip image, next and previous", async function () {
                    const dateInfo = answers["date-scrape"];
                    contains(
                        dateInfo.out, await prov.getDate(dateInfo.in.name,dateInfo.in.date),true
                    );
                });
                //TODO Find way to confirm last comic strip date
            })
        );
    });
});