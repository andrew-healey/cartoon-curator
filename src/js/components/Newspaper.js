import moment from "moment";
import React, {
    Component
} from "react";
import Comic from "./Comic";
import {
    dateFromPath,
    getCookie
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
        let comics = search.getAll("comic");
        comics = comics.length > 0 ? comics :
            getCookie("comic").split("_,_").filter(i => i.length > 0).map(comic => comic.replace(/,,/g, ","));
        window.getCookie=getCookie;
        comics = comics.length > 0 ? comics.map(i => ({
            id: i
        })) : [{
                id: "pearlsbeforeswine",
                name: "Pearls Before Swine"
            },
            {
                id: "dilbert-classics",
                name: "Dilbert Classics"
            },
            {
                id: "lio",
                name: "Lio"
            },
            {
                id: "calvinandhobbes",
                name: "Calvin and Hobbes"
            },
            {
                id: "foxtrot",
                name: "Foxtrot"
            },
            {
                id: "dilbert",
                name: "Dilbert"
            },
            {
                id: "garfield",
                name: "Garfield"
            }
        ];
        this.state.comics = comics;
        let date = moment(this.state.date).format("YYYY/MM/DD");
        document.title = moment(this.state.date).format("MMMM D[, ]YYYY");
        let newComics = this.state.comics.map(comic => ({ ...comic,
            date
        }));
        this.state.comics = newComics;
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
              name={i.name}
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
                    date: moment(this.state.date).format("YYYY/MM/DD")
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
        newThing.date = dateFromPath(path);
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
        let str = mom.format("YYYY/MM/DD");
        let newComics = this.state.comics.map(comic => ({ ...comic,
            date: str
        }));
        this.setURL(undefined, str);
        // window.history.pushState(date, moment(date).format("MMMM D[,] YYYY"), this.url.toString()/*moment(date).format("[?year=]YYYY[&month=]MM[&day=]DD")*/);
        this.setState({
            date,
            comics: newComics
        });
    }
    setURL(comics, date = this.state.date) {
        let mom = moment(date);
        //   alert(this.url);
        if (comics) {
            this.url.delete("comic");
            for (let comic of comics) {
                this.url.append("comic", comic.id);
            }
            const comStr = comics.map(comic => comic.id.replace(/,/g, ",,").replace(/;/g, " , ")).join("_,_");
            document.cookie = "comic=" + comStr;
        }
        if (date) {
            const dateStuff = [
                ["year", "YYYY"],
                ["month", "MM"],
                ["day", "DD"]
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
