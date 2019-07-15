const {
    loadProviders,
    Provider
} = require("../../backend/providers.js");
const assert = require("assert");
const {
    contains
} = require("../../util");
let providers, providerAnswers, providerInstances;
before("Retrieves providers in JSON format", async function () {
    providers = await loadProviders();
    providerAnswers = await loadProviders(__dirname, /^(.*)\.test\.json$/, "$1.test.json");
    providerInstances = Object.keys(providers).map(provName => new Provider(provName, providers[provName]));
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
    describe("Gets first comic strip", function () {
        providerInstances.forEach(prov => it(prov.name, async function () {
            const answer = providerAnswers[prov.name];
            const extInfo = answer["extremes-scrape"].first;
            contains(
                extInfo.out, await prov.getFirst(extInfo.in)
            );
        }))
    });
    describe("Gets comic strip image, next and previous", function () {
        it("Does stuff", () => assert(true));
        providerInstances.forEach(prov => it(prov.name, async function () {
            const answer = providerAnswers[prov.name];
            const dateInfo = answer["date-scrape"];
            contains(
                dateInfo.out, await prov.getDate(dateInfo.name, dateInfo.date), true
            );
        }))
    });
});

// it("This will run?", () => assert(true));
// });

// describe("Heyy!", () => {
//     [
//         [5, 1, 4]
//     ].forEach(
//         i => it("Adds numbers", async () => assert.equal(i[0] - i[1], i[2]))
//     )
// });

/*
it("Gets first comic strip", async () =>
    providerInstances.forEach(prov => {
        const first = providerAnswers[prov.name].first;
        contains(
            extInfo.out, await prov.getFirst(extInfo.in), true
        );
    }));
it("Gets comic strip image, next and previous", async () =>
    providerInstances.forEach(prov => ));
    */