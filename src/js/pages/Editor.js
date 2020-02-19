import React,{createRef} from 'react';
import '../../css/Editor.css';
import Editor from 'react-json-editor-ajrm';
import {
    API_URL
} from '../util';

class App extends React.Component {
    constructor(props) {
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
                "series-ids": []
            }),
            password: "",
            output: {},
            apiUrl: API_URL + "/api/v1/"
        };
        const search = new URLSearchParams(window.location.search);
        const toEdit = search.get("edit");
        if (toEdit) fetch(API_URL + "/api/v1/" + toEdit).then(res => res.text()).then(text => this.setState({
            currJson: JSON.parse(text.replaceAll("\\","\\\\"))
        }));
    }

    copyToClipboard(){
        navigator.clipboard.writeText(JSON.stringify(this.state.currJson,null));
    }

    render() {
        const editorProps={ style:{outerBox:{flexGrow:"1",height:"100%"},container:{width:"100%",height:"100%"}},theme:"light_mitsuketa_tribute"};
        return (
            <div className="App">
                                    Password: <input type="password" size="50" value={this.state.password} onChange={(evt)=>this.setState({password:evt.target.value})}></input>
                                            <br/>
                                                    API URL: <input type="text" size="50" value={this.state.apiUrl} onChange={(evt)=>this.setState({apiUrl:evt.target.value})}></input>
                                                            <br/>
                                                                    Query Path: <input type="text" size="50" value={this.state.query} onChange={(evt)=>this.setState({query:evt.target.value})}></input>
                                                                    <input type="button" value="Test" onClick={()=>this.runJSON()}/>
                                                                            <br/>
                                                                    <input type="button" value="Copy to Clipboard" onClick={()=>this.copyToClipboard()}/>
                                                                            <div className="textarea-holder">
                                                                                <Editor placeholder={this.state.currJson} onChange={(evt)=>this.setState({currJson:evt.jsObject})} {...editorProps} />
                                                                                            <img className="sample-image" src={this.state.output.url} style={{maxWidth:"49vw",height:"auto"}}/>
                                                                                            <Editor readOnly placeholder={(this.state.output)} {...editorProps}/>>
                                                                                                        </div>
                                                                                                    <br/>
                                                                                                                  </div>
        );
    }
    async runJSON() {
        try {
            const parsed = this.state.currJson;
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
                output
            });
        } catch (err) {
            alert(err.message);
        }
    }
}

export default App;
