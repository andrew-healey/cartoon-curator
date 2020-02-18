import React from 'react';
import '../../css/App.css';
import { JsonEditor as Editor } from 'jsoneditor-react';
import 'jsoneditor-react/es/editor.min.css';
import {API_URL} from '../util';

class App extends React.Component {
      constructor(props){
              super(props);
              this.state={editingString:JSON.stringify({
                        id:"",
                        name:"",
                        "series-ids":["YYYY-MM-DD"],
                        "date-scrape":[],
                        "extremes-scrape":{
                                    first:[],
                                    last:[]
                                  },
                        "get-name":[],
                        "src-to-url":"${src}",
                        "list-names":[],
                        "series-ids":[]
                      },null,"\n"),password:"",output:{},apiUrl:API_URL+"/api/v1/"
                      };
            }
      render(){
              return (
                        <div className="App">
                                    Password: <input type="password" size="50" value={this.state.password} onChange={(evt)=>this.setState({password:evt.target.value})}></input>
                                            <br/>
                                                    API URL: <input type="text" size="50" value={this.state.apiUrl} onChange={(evt)=>this.setState({apiUrl:evt.target.value})}></input>
                                                            <br/>
                                                                    Query Path: <input type="text" size="50" value={this.state.query} onChange={(evt)=>this.setState({query:evt.target.value})}></input>
                                                                            <br/>
                                                                                    <textarea value={this.state.editingString} onChange={(evt)=>this.setState({editingString:evt.target.value})} onPaste={(evt)=>this.setState({editingString:evt.target.value})} onClick={(evt)=>this.updateJSON(evt.target.value)} style={{height:"500px",width:"49vw",display:"inline"}}></textarea>
                                                                                            <img src={this.state.output.url} style={{maxWidth:"49vw",height:"auto"}}/>
                                                                                                    <br/>
                                                                                                            <Editor value={JSON.stringify(this.state.output)}></Editor>
                                                                                                                  </div>
                  );
            }
      async updateJSON(str){
              try{
                        console.log("welp");
                        this.setState({editingString:str});
                        const parsed=JSON.parse(str);
                        console.log("Darn");
                        const didPost=await (await fetch(this.state.apiUrl+"provider",{method:"POST",mode:'cors',headers:{"Content-Type":"application/json"},body:JSON.stringify({
                                    json:parsed,
                                    password:this.state.password,
                                  })})).json()
                        console.log("dern");
                        const output=await (await fetch(this.state.apiUrl+this.state.query)).json();
                        console.log("doorn");
                        this.setState({output});
                      } catch(err){
                                return;
                              }
            }
}

export default App;

