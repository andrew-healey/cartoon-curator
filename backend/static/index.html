<h1>Endpoints:</h1>

<div>
    API V2
    Base url: <a href="/api/v2/">&lt;API_URL&gt;/api/v2</a>
    <ul>
        <li>
            GET /series/:providerId/:seriesId

            <br>
            Returns:
            <br>

            Either a 404 or
            <br>
            
            {
            <br>
                name: "Name of the series",
            <br>
                last: "Optional date of the most recently released comic",
            <br>
                first: "Optional date of the first comic",
            <br>
                description: "Optional description of the series"
            <br>
            }
        </li>
        <li>
            GET /comic/:providerId/:seriesId/:year/:month/:day
            <br>

            Returns:
            <br>

            Either a 404 or
            <br>

            {
            <br>
                url: "Image URL of the comic",
            <br>
                previous: "Optional date in YYYY/MM/DD format of the previous comic",
            <br>
                next: "Optional date in YYYY/MM/DD format of the next comic",
            <br>
                alt: "Optional alt text for the image",
            <br>
                description: "Optional description/title for the comic"
            <br>
            }
        </li>
        <li>
            GET /provider
            <br>

            Returns:
            <br>

            {
            <br>
                "id of one provider":["seriesId of one series provided by provider","another one",...],
            <br>
                "id of another provider":["seriesId of a series provided by another provider","another one",...],
            <br>
                ...
            <br>
            }
        </li>
        <li>
            POST /provider
            <br>

            Body: {
            <br>
                password: "Optional password",
            <br>
                json:{
            <br>
                    name:"Name of the provider",
            <br>
                    id:"Unique ID of the provider",
            <br>
                    "series-ids":["seriesId of one series served by this provider","seriesId of another"],
            <br>
                    "date-scrape":["An object representing one step in the scraper, see the source code for details","Another step"], // Must return a variable src; description, alt, previous and next are optional
            <br>
                    "extremes-scrape":{
            <br>
                        "last":["An object representing one step","Another"], // Can optionally return a variable first representing the date that the first comic was available
            <br>
                        "first":["An object representing one step","Another"], // Can optionally return a variable last representing the date of the most recent comic
            <br>
                    },
            <br>
                    "src-to-url":"Regex turning the src attribute into an image URL. Used so that src can be stored efficiently.",
            <br>
                    "get-name":["An object representing one step","Another"], // Must return a name variable
            <br>
                    "list-names":["An object representing one step","Another"], // Is optional. Can optionally return a list of seriesIds supported by this provider. Either list-names or series-ids is required. If series-ids is not defined, list-names is used to generate it. list-names is preferred for providers providing many series, such as GoComics or Comics Kingdom. series-ids is preferred for providers providing one or two series, such as xkcd or User Friendly.
            <br>
                    "description": "An optional description of the provider",
            <br>
                    "get-description":["An object representing one step","Another"] // Optional. Returns an optional variable description, which represents the description of a series.
            <br>
                }
            <br>
            }
            <br>

            Returns:
            <br>

            {
            <br>
                saved:true, // Represents if the request has caused an update in the database.
            <br>
                password:"The password either provided by the person or generated randomly by the server."
            <br>
            }
        </li>
        <li>
            GET /provider/:providerId
            <br>

            Body: {
            <br>
                name:"Name of the provider",
            <br>
                id:"Unique ID of the provider",
            <br>
                "series-ids":["seriesId of one series served by this provider","seriesId of another"],
            <br>
                "date-scrape":["An object representing one step in the scraper, see the source code for details","Another step"], // Must return a variable src; description, alt, previous and next are optional
            <br>
                "extremes-scrape":{
            <br>
                    "last":["An object representing one step","Another"], // Can optionally return a variable first representing the date that the first comic was available
            <br>
                    "first":["An object representing one step","Another"], // Can optionally return a variable last representing the date of the most recent comic
            <br>
                },
            <br>
                "src-to-url":"Regex turning the src attribute into an image URL. Used so that src can be stored efficiently.",
            <br>
                "get-name":["An object representing one step","Another"], // Must return a name variable
            <br>
                "list-names":["An object representing one step","Another"], // Is optional. Can optionally return a list of seriesIds supported by this provider. Either list-names or series-ids is required. If series-ids is not defined, list-names is used to generate it. list-names is preferred for providers providing many series, such as GoComics or Comics Kingdom. series-ids is preferred for providers providing one or two series, such as xkcd or User Friendly.
            <br>
                "description": "An optional description of the provider",
            <br>
                "get-description":["An object representing one step","Another"] // Optional. Returns an optional variable description, which represents the description of a series.
            <br>
            }
        </li>
        <li>
            GET /newspaper
            <br>

            Returns:
            <br>

            ["newspaperId of a newspaper","newspaperId of another"]
        </li>
        <li>
            GET /newspaper/:newspaperId
            <br>

            Returns:
            <br>

            {
            <br>
                newsId: "newspaperId of the newspaper",
            <br>
                name: "Name of the newspaper",
            <br>
                seriesInfo:[{
            <br>
                    seriesId:"seriesId of one series in the newspaper",
            <br>
                    x:0,
            <br>
                    y:12
            <br>
                }]
            <br>
            }
        </li>
        <li>
            POST /newspaper
            <br>

            Body: {
            <br>
                newsId: "Unique id of the newspaper",
            <br>
                password: "Optional password for the newspaper",
            <br>
                seriesInfo: [{
            <br>
                    seriesId: "The seriesId of one series in the newspaper",
            <br>
                    x: 0, // The x value of the series, can be percentage or otherwise
            <br>
                    y: 0, // The y value of the series on the screen
            <br>
                }]
            <br>
            }
        </li>
</div>
