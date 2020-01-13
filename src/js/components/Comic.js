import React, {
    Component
} from "react";
import {
    API_URL,
    API_VERSION,
} from "../util";
import ComicChoice from "./ComicChoice";
export default class Comic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            date: this.props.date||"",
            strips: {},
            shown: true,
            id: this.props.id,
            name: undefined,
            provider: this.props.provider,
        };
    }
    static getDerivedStateFromProps(newProps, oldState) {
        return newProps.date !== oldState.date ? {
            date: newProps.date
        } : null;
    }
    componentDidMount() {
        if (this.state.id) this.findUrl(this.state.date);
    }
    componentDidUpdate() {
        this.findUrl();
    }
    render() {
        console.log(this.state.id,this.state.provider);
        let thisComic = this.state.strips[this.state.date] || {};

        return this.state.date !== "" && this.state.id ? (
            thisComic.url ? (
                <div className="comic-container">
          <h2>{this.state.name}</h2>
          <p>{this.state.date}</p>
          <span role="img" aria-label="Delete" onClick={this.props.remove}>
            ❌
          </span>
          <div className="comic">
            <link
              ref="previous"
              rel="preload"
              as="image"
              href={(this.state.strips[thisComic.previous] || {}).url}
            />
            <img
              ref="this"
              alt={this.state.name || this.state.id + " comic strip"}
              src={thisComic.url}
              onClick={() => this.props.setDate(thisComic.previous)}
            />
            <link
              ref="next"
              rel="preload"
              as="image"
              href={(this.state.strips[thisComic.next] || {}).url}
            />
            <div className="overlay">
              <input
                type="button"
                onClick={() => this.props.setDate(thisComic.previous)}
                value=""
                className="arrow"
              />
              <input
                type="button"
                onClick={() => this.props.setDate(thisComic.next)}
                value=""
                className="arrow"
              />
            </div>
          </div>
        </div>
            ) : null
        ) : (
            <div className="input-container">
        <ComicChoice
          updateValue={val =>{
              console.log("updateValue",val);
              this.props.updateVals({ id: val.id, name: val.name,provider:val.provider })
          }
          }
        />
      </div>
        );
    }
    async findUrl(date) {
        if(!(this.state.id&&this.state.provider)) return;
        if(this.state.id&&this.state.provider&&!this.state.name) {
            fetch(`${API_URL}/api/${API_VERSION}/${this.state.provider}/${this.state.id}`)
                .then(resp=>resp.json()).then(json=>this.setState({name:json.name}));
        }
        date = date || this.state.date;
        let thisComic,
            strips = {};
        if (!Object.keys(this.state.strips).includes(date)) {
            let url = this.getUrl(date);
            let json = await fetch(url);
            json = await json.json();
            if (json.error) {
                console.log(url, "failed");
            }
            thisComic = json;
        } else {
            thisComic = this.state.strips[date];
        }
        strips[date] = thisComic;
        if (this.state.date !== date) {
            this.setState({
                date
            });
        }
        for (let order of ["previous", "next"]) {
            if (!this.state.strips[thisComic[order]] &&
                thisComic[order] &&
                thisComic[order] !== ""
            ) {
                let url = this.getUrl(thisComic[order]);
                let json = await fetch(url);
                try {
                    json = await json.json();
                } catch (err) {
                    continue;
                }
                strips[thisComic[order]] = json;
            } else {
                strips[thisComic[order]] = this.state.strips[thisComic[order]];
            }
        }
        let oldKeys = Object.keys(this.state.strips);
        if (Object.keys(strips).filter(i => !oldKeys.includes(i)).length > 0) {
            this.setState({
                strips
            });
        }
    }
    getUrl(date) {
        return `${API_URL}/api/${API_VERSION}/${this.state.provider}/${this.state.id}/${date}`
    }
}
