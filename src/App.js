import React, { Component } from 'react';
import logo from './logo.svg';
import moment from "moment";
import './App.css';

class App extends Component {
  constructor(props){
    super(props);
    this.state={date:window.location.pathname=="/"?new Date():new Date(window.location.path.substr(1)),comics:[{id:"pearlsbeforeswine",name:"Pearls Before Swine"},
{id:"dilbert-classics",name:"Dilbert Classics"},
{id:"lio",name:"Lio"},
{id:"calvinandhobbes",name:"Calvin and Hobbes"},
{id:"foxtrot",name:"Foxtrot"},
{id:"dilbert",name:"Dilbert"},
{id:"garfield",name:"Garfield"},]};
  let date=moment(this.state.date).format("YYYY/MM/DD");
  let newComics=this.state.comics.map(comic=>({...comic,date}));
  this.state.comics=newComics;
  }
  render() {
    //console.log(this.state.comics);
    return (
      <>
      <button onClick={()=>this.addDays(-1)} className="changeDate">&lt;</button>
      <button onClick={()=>this.addDays(1)} className="changeDate next">&gt;</button>
      <div className="App">
        {this.state.comics.map((i,index)=><Comic remove={()=>this.popComic(index)} setDate={path=>this.setDate(index,path)} key={i.id} date={i.date} id={i.id} name={i.name}/>)}
        <div className="input-container">
        <input type="button" onClick={()=>this.addComic()} className="plus" value="+"/>
        </div>
      </div>
      </>
    );
  }
  addComic(){
    this.setState({comics:[...this.state.comics,{id:"",name:""}]});
  }
  setDate(id,path){
    //console.log("Setting date!",this.state.comics[id],id,path);
    let newComics=[...this.state.comics];
    let newThing={...newComics[id]};
    newThing.date=path.replace(/\/[^\/]*\/(.*)$/g,"$1");
    newComics[id]=newThing;
    this.setState({comics:newComics});
  }
  popComic(index){
    let list=[...this.state.comics];
    let ret=list.splice(index,1);
    this.setState({comics:list});
    return ret;
  }
  addDays(numDays){
    let newDate=new Date();
    newDate.setDate(this.state.date.getDate()+numDays);
    this.state.date=newDate;
    this.applyDate(moment(newDate).format("YYYY/MM/DD"));
  }
  applyDate(date){
    let newComics=this.state.comics.map(comic=>({...comic,date}));
    this.setState({comics:newComics});
  }
}

class Comic extends Component{
  constructor(props){
    super(props);
    this.date=this.props.date;
    this.state={path:"",strips:{},shown:true,id:this.props.id,name:this.props.name};
    if(this.state.id) {
      this.state.path=this.getPath();
      this.findUrl(this.state.path);
    }
  }
  render(){
    this.date=this.props.date;
    //console.log(this.props.date,"is date at render");
    this.state.path=this.getPath();
    console.log(this.state.path);
    //console.log("now, path is",this.state.path,this.date);
    let thisComic=this.state.strips[this.state.path]||{};
    //console.log("rendering in render",this.state,"thisComic at render",thisComic);
    //if(!thisComic.url)
    this.findUrl(this.state.path);
    return this.state.path!==""&&this.state.id?
    (
      thisComic.url?<div className="comic-container">
        <h2>{this.state.name}</h2>
        <p>{this.state.path.replace(/^\/[^\/]+\/(.*)$/g,"$1")}</p>
        <span onClick={this.props.remove}>❌</span>
        <span className="comic">
        <input type="button" onClick={()=>this.findUrl(thisComic.previous)} value="←" className="arrow"/>
        <img ref="next" style={{display:"none"}} src={(this.state.strips[thisComic.previous]||{}).url} onClick={()=>this.findUrl(thisComic.previous)}/>
        <span>
        <img ref="this" src={thisComic.url} onClick={()=>this.findUrl(thisComic.previous)}/>
        </span>
        <img ref="last" style={{display:"none"}} src={(this.state.strips[thisComic.next]||{}).url} onClick={()=>this.findUrl(thisComic.previous)}/>
        <input type="button" onClick={()=>this.findUrl(thisComic.next)} value="→" className="arrow"/>
        </span>
      </div>:null
    ):(
      <div className="input-container">
      <ComicChoice updateValue={(val)=>{this.state.id=val.id;this.state.name=val.name;this.state.path=this.getPath();this.findUrl();}}/>
      </div>
    );
    /*
    Old:
    
        <input type="text" onChange={event=>{this.state.name=event.target.value;if(this.state.id)this.findUrl();}} placeholder="Name"/>
        <input type="text" onChange={event=>{this.state.id=event.target.value;this.state.path=this.getPath();this.findUrl();}} placeholder="Comic ID"/>
    */
  }
  async findUrl(path){
    //console.log("running findUrl");
    path=path||this.getPath();
    let thisComic, strips={};
    let num=Math.random();
    if(!Object.keys(this.state.strips).includes(path)){
      let url=`https://Comic-Strip-API.426729.repl.co/api${path}`;
      //console.log(url);
      let json=await fetch(url);
      json=await json.json();
      if(json.error) return //console.log(url);
      thisComic=json;
      //console.log(path,json.url);
    }
    else {
      //console.log("Cached");
      thisComic=this.state.strips[path];
      //console.log("thisComic ",thisComic);
    }
    ////console.log("thisComic",thisComic);
    strips[path]=thisComic;
    this.props.setDate(path);
    // this.setState({path});
    for(let order of ["previous","next"]){
      if(!this.state.strips[thisComic[order]]&&thisComic[order]&&thisComic[order]!=="") {
        //console.log("Not working path",thisComic[order]);
        let url=`https://Comic-Strip-API.426729.repl.co/api${thisComic[order]}`;
        //console.log(url);
        let json=await fetch(url);
        try{json=await json.json();} catch(err){continue;}
        //console.log("Adding the cache for",thisComic[order],json.url)
        strips[thisComic[order]]=json;
      }
    }
    //console.log("Strips")
    this.setState({strips});
  }
  getPath(date=this.date){
    return `/${this.state.id}/${date}`;
  }
}

class ComicChoice extends Component{
  constructor(props) {
    super(props);
    this.state={strips:{"Select":""}};
    this.findStrips();
  }
  render(){
    return <select className="comic-choice" onChange={event=>this.props.updateValue({name:event.target.value,id:this.state.strips[event.target.value]})}>
    {Object.keys(this.state.strips).map(i=><option value={i}>{i}</option>)}
    </select>;
  }
  async findStrips(){
    let strips=await fetch("https://comic-strip-api.426729.repl.co/ids");
    strips=await strips.json();
    let newStrips={"Select":""};
    for(let key of Object.keys(strips)){
      newStrips={...newStrips,...strips[key]};
    }
    this.setState({strips:newStrips});
  }
}

export default App;
