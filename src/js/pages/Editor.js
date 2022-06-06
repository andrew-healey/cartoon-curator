/*eslint-disable no-template-curly-in-string*/
/*eslint-disable react/no-direct-mutation-state*/
/*eslint-disable no-unused-vars*/
/*eslint-disable jsx-a11y/alt-text*/
/*eslint-disable no-mixed-operators*/
import React from 'react';
import '../../css/Editor.css';
import Editor from 'react-json-editor-ajrm';
import {
    API_URL
} from '../util';

class App extends React.Component {
    constructor(props) {
        document.title = "Editor";
        super(props);
        this.state = {
            currJson: ({
                id: "",
                name: "",
                "series-ids": ["YYYY-MM-DD"],
                "date-scrape": [],
                "extremes-scrape": {
                    first: [],
                    last: []
                },
                "get-name": [],
                "src-to-url": "${src}",
                "list-names": [],
            }),
            password: "",
            output: {},
            apiUrl: API_URL + "/api/v1/",
        };
        const search = new URLSearchParams(window.location.search);
        const toEdit = search.get("edit");
        if (toEdit) fetch(API_URL + "/api/v1/" + toEdit).then(res => res.text()).then(text => this.setState({
            currJson: JSON.parse(text.replaceAll("\\\\", "\\\\\\\\"))
        }));
    }

    copyToClipboard() {
        navigator.clipboard.writeText(JSON.stringify(this.state.currJson, null));
    }

    render() {
        const editorProps = {
            style: {
                outerBox: {
                    flexGrow: "1",
                    height: "100%"
                },
                container: {
                    width: "100%",
                    height: "100%"
                }
            },
            theme: "light_mitsuketa_tribute"
        };
        return ( <
            div className = "Editor" >
            Password: < input type = "password"
            size = "50"
            value = {
                this.state.password
            }
            onChange = {
                (evt) => this.setState({
                    password: evt.target.value
                })
            } > < /input> <
            br / >
            API URL: < input type = "text"
            size = "50"
            value = {
                this.state.apiUrl
            }
            onChange = {
                (evt) => this.setState({
                    apiUrl: evt.target.value
                })
            } > < /input> <
            br / >
            Query Path: < input type = "text"
            size = "50"
            value = {
                this.state.query
            }
            onChange = {
                (evt) => this.setState({
                    query: evt.target.value
                })
            } > < /input> <
            input type = "button"
            value = "Test"
            onClick = {
                () => this.runJSON()
            }
            /> <
            br / >
            <
            input type = "button"
            value = "Copy to Clipboard"
            onClick = {
                () => this.copyToClipboard()
            }
            /> <
            div className = "textarea-holder" >
            <
            Editor placeholder = {
                this.state.currJson
            }
            onChange = {
                (evt) => {
                    this.state.tempJson = evt.jsObject;
                    this.state.tempStr = evt.json;
                }
            } {
                ...editorProps
            }
            /> <
            img className = "sample-image"
            src = {
                this.state.output.url
            }
            style = {
                {
                    maxWidth: "49vw",
                    height: "auto"
                }
            }
            /> <
            Editor readOnly placeholder = {
                (this.state.output)
            } {
                ...editorProps
            }
            />> <
            /div> <
            br / >
            <
            /div>
        );
    }
    async runJSON() {
        try {
            const parsed = this.state.tempJson || this.state.currJson;
            this.setState({
                currJson: this.state.tempStr && JSON.parse(this.state.tempStr.replaceAll("\\\\", "\\\\\\\\")) || this.state.tempJson
            });
            const didPost = await (await fetch(this.state.apiUrl + "provider", {
                method: "POST",
                mode: 'cors',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    json: parsed,
                    password: this.state.password,
                })
            })).json()
            const output = await (await fetch(this.state.apiUrl + this.state.query)).json();
            this.setState({
                output: output || {}
            });
        } catch (err) {
            alert(err.message);
        }
    }
}

export default App;