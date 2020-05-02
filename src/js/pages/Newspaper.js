import moment from "moment";
import React, {
    Component
} from "react";
import Comic from "../components/Comic";
import {
    getCookie,
    SAVE_AS_URL,
} from "../util";

export default class Newspaper extends Component {
    constructor(props) {
        super(props);
        let search = new URLSearchParams(window.location.search);
        this.url = search;
        this.state = {
            date: ["year", "month", "day"].reduce(
                    (last, next) => last || !search.get(next),
                    false
                ) ?
                new Date() : new Date(
                    search.get("year"),
                    search.get("month") - 1,
                    search.get("day")
                ),
            comics: []
        };
        const zip = (...rows) => rows.reduce((last, next) => last.slice(0, next.length).map((i, ind) => [i, next[ind]]));
        let comics = zip(search.getAll("comic"), search.getAll("provider"))
        comics = comics.length > 0 ? comics :
            zip(JSON.parse(getCookie("comic") || "[]"), JSON.parse(getCookie("provider") || "[]"));
        comics = comics.length > 0 ? comics.map(i => ({
            id: i[0],
            provider: i[1],
        })) : [{
                provider: "gocomics",
                id: "pearlsbeforeswine",
            },
            {
                provider: "dilbert",
                id: "dilbert",
            },
            {
                provider: "gocomics",
                id: "dilbert-classics",
            },
            {
                provider: "xkcd",
                id: "xkcd",
            },
            {
                provider: "smbc",
                id: "smbc",
            },
            {
                provider: "comicskingdom",
                id: "sherman-s-lagoon",
            },
            {
                provider: "comicskingdom",
                id: "dustin",
            },
            {
                provider: "comicskingdom",
                id: "rhymes-with-orange",
            },
            {
                provider: "gocomics",
                id: "lio",
            },
            {
                provider: "gocomics",
                id: "calvinandhobbes",
            },
            {
                provider: "gocomics",
                id: "foxtrot",
            },
            {
                provider: "gocomics",
                id: "garfield",
            }
        ];
        this.state.comics = comics;
        let date = moment(this.state.date).format("YYYY/M/D");
        document.title = moment(this.state.date).format("MMMM D[, ]YYYY");
        let newComics = this.state.comics.map(comic => ({ ...comic,
            date
        }));
        this.state.comics = newComics;
        if(search.get("sync")==="true") this.setURL(this.state.comics,this.state.date,true);
    }
    render() {
        return (
            <div className="App">
        <div className="navBar">
          <button onClick={() => this.addDays(-1)} className="changeDate">
            &lt;
          </button>
          <h1 className="title">Cartoon Curator</h1>
          <button onClick={() => this.addDays(1)} className="changeDate next">
            &gt;
          </button>
        </div>
        <div className="body">
          {this.state.comics.map((i, index) => (
            <Comic
              updateVals={newVal => this.updateValue(index, newVal)}
              remove={() => this.popComic(index)}
              setDate={path => this.setDate(index, path)}
              key={i.id}
              date={i.date}
              id={i.id}
              provider={i.provider}
            />
          ))}
          <div className="input-container">
            <input
              type="button"
              onClick={() => this.addComic()}
              className="plus"
              value="+"
            />
          </div>
        </div>
      </div>
        );
    }
    addComic() {
        this.setState({
            comics: [
                ...this.state.comics,
                {
                    id: "",
                    name: "",
                    date: moment(this.state.date).format("YYYY/M/D")
                }
            ]
        });
    }
    updateValue(index, value) {
        let comics = [...this.state.comics];
        comics[index] = Object.assign({}, comics[index], value);
        this.setURL(comics);
        this.setState({
            comics
        });
    }
    setDate(id, path) {
        let newComics = [...this.state.comics];
        let newThing = { ...newComics[id]
        };
        newThing.date = path;
        newComics[id] = newThing;
        this.setState({
            comics: newComics
        });
    }
    popComic(index) {
        let list = [...this.state.comics];
        let ret = list.splice(index, 1);
        this.setState({
            comics: list
        });
        this.setURL(list);
        return ret;
    }
    addDays(numDays) {
        let newDate = new Date(this.state.date);
        newDate.setDate(this.state.date.getDate() + numDays);
        // this.state.date=newDate;
        this.applyDate(newDate);
    }
    applyDate(date) {
        let mom = moment(date);
        let str = mom.format("YYYY/M/D");
        let newComics = this.state.comics.map(comic => ({ ...comic,
            date: str
        }));
        this.setURL(undefined, str);
        // window.history.pushState(date, moment(date).format("MMMM D[,] YYYY"), this.url.toString()/*moment(date).format("[?year=]YYYY[&month=]M[&day=]D")*/);
        this.setState({
            date,
            comics: newComics
        });
    }
    setURL(comics, date = this.state.date, doQuery = false) {
        let mom = moment(date);
        //   alert(this.url);
        if (comics) {
            this.url.delete("comic");
            this.url.delete("provider");
            if (SAVE_AS_URL||doQuery) {
                for (let comic of comics) {
                    this.url.append("comic", comic.id);
                    this.url.append("provider", comic.provider);
                }
            }
            //const sanitize = m => m.replace(/,/g, ",,").replace(/;/g, " , ");
            [
                ["id", "comic"],
                ["provider", "provider"]
            ].forEach(([key, name]) => {
                document.cookie = name + "=" + escape(JSON.stringify(comics.map(comic => comic[key])))
            });
        }
        if (date) {
            const dateStuff = [
                ["year", "YYYY"],
                ["month", "M"],
                ["day", "D"]
            ];
            dateStuff.forEach(([part, format]) => {
                const val = mom.format(format);
                this.url.set(part, val);
                document.cookie = `${part}=${val}`;
            });
        }
        window.history.pushState(
            date,
            moment(date).format("MMMM D[,] YYYY"),
            "?" + this.url.toString()
        );
    }
}
