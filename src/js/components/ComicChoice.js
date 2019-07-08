import React, {Component} from 'react';
import {API_URL} from '../util';
export default class ComicChoice extends Component{
  constructor(props) {
    super(props);
    this.state={strips:{"Select":""}};
    this.findStrips();
  }
  render(){
    return <select className="comic-choice" onChange={event=>this.props.updateValue({name:event.target.value,id:this.state.strips[event.target.value]})}>
    {Object.keys(this.state.strips).sort((last,next)=>next>last).map(i=><option key={i} value={i}>{i}</option>)}
    </select>;
  }
  async findStrips(){
    let strips=await fetch(`${API_URL}/ids`);
    strips=await strips.json();
    let newStrips={"Select":""};
    for(let key of Object.keys(strips)){
      newStrips={...newStrips,...strips[key]};
    }
    this.setState({strips:newStrips});
  }
}