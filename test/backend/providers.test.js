const {
    loadProviders,
    Provider
} = require("../../backend/providers.js");
const {assert} = require("chai");
const {
    contains
} = require("../../util");
let providers, providerAnswers, providerInstances;
describe("Provider class", function () {
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
        this.timeout(3000);
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

describe("Providers", async function () {
    providers = await loadProviders();
    providerAnswers = await loadProviders(__dirname, /^(.*)\.test\.json$/, "$1.test.json");
    providerInstances = Object.keys(providers).map(provName => new Provider(provName, providers[provName]));
    const comicTest = (desc, getContext, func,timeout) =>
        describe(desc, function () {
            if(timeout)this.timeout(timeout);
            providerInstances.forEach(prov => it(prov.name, async function () {
                const answer = providerAnswers[prov.name];
                const extInfo = getContext(answer);
                contains(
                    extInfo.out, await func(extInfo, prov)
                );
            }));
        });
    comicTest("Gets first comic strip", ans => ans["extremes-scrape"].first, async (data, prov) => await prov.getFirst(data.in),4000);
    comicTest("Gets comic strip image, next and previous", ans => ans["date-scrape"], async (data, prov) => await prov.getDate(data.in.name, data.in.date),3000);
    comicTest("Gets last comic strip", ans => ans["extremes-scrape"].last, async (data, prov) => await Provider.scrapes((await prov.getLast(data.in)).last, data.scrape),3000);
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