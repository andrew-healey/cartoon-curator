(this.webpackJsonprunner=this.webpackJsonprunner||[]).push([[0],{164:function(e,t,a){e.exports=a(367)},169:function(e,t,a){},361:function(e,t,a){},362:function(e,t,a){},367:function(e,t,a){"use strict";a.r(t);var s=a(1),r=a.n(s),i=a(159),n=a.n(i),c=(a(169),a(170),a(171),a(174),a(175),a(176),a(177),a(178),a(179),a(180),a(181),a(182),a(183),a(184),a(186),a(187),a(104),a(190),a(192),a(193),a(194),a(195),a(196),a(197),a(198),a(199),a(200),a(203),a(204),a(106),a(206),a(208),a(209),a(210),a(212),a(214),a(215),a(216),a(217),a(218),a(219),a(220),a(221),a(222),a(223),a(224),a(225),a(226),a(227),a(147),a(228),a(229),a(230),a(232),a(233),a(234),a(235),a(237),a(238),a(239),a(240),a(241),a(242),a(245),a(246),a(247),a(248),a(249),a(250),a(251),a(252),a(253),a(254),a(255),a(256),a(112),a(257),a(258),a(259),a(260),a(261),a(262),a(263),a(265),a(266),a(267),a(268),a(269),a(270),a(271),a(272),a(274),a(275),a(276),a(277),a(278),a(279),a(280),a(281),a(282),a(283),a(284),a(285),a(286),a(289),a(290),a(291),a(292),a(293),a(294),a(295),a(297),a(298),a(299),a(301),a(302),a(304),a(305),a(306),a(307),a(308),a(309),a(310),a(311),a(312),a(313),a(314),a(315),a(316),a(317),a(318),a(319),a(320),a(321),a(322),a(323),a(324),a(325),a(326),a(327),a(328),a(329),a(330),a(331),a(332),a(333),a(334),a(335),a(337),a(338),a(339),a(340),a(341),a(342),a(343),a(344),a(345),a(346),a(347),a(348),a(350),a(351),a(352),a(353),a(356),a(157),window.location.origin.startsWith("http://localhost:")?"http://localhost:3000":"https://comic-strip-api.426729.repl.co");window.API_URL=c;function o(e){return unescape(document.cookie.replace(new RegExp("(?:(?:^|.*;\\s*)"+e+"\\s*\\=\\s*([^;]*).*$)|^.*$"),"$1"))}a(357);var l=a(163),p=a(25),d=a(48),m=a.n(d),u=a(37),h=a.n(u),v=a(53);class g extends s.Component{constructor(e){super(e),this.state={strips:{Select:""}},this.findStrips()}render(){return r.a.createElement("select",{className:"comic-choice",onChange:e=>this.props.updateValue(Object(p.a)({name:e.target.value},this.state.strips[e.target.value]))}," ",Object.keys(this.state.strips).sort((e,t)=>t>e).map(e=>r.a.createElement("option",{key:e,value:e}," ",e," "))," ")}findStrips(){var e=this;return Object(v.a)(h.a.mark((function t(){var a,s,r,i,n;return h.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,fetch("".concat(c,"/api/").concat("v1","/ids"));case 2:return a=t.sent,t.next=5,a.json();case 5:for(a=t.sent,s={Select:[null,null]},r=function(){var e=n[i],t=a[e];console.log(t);var r=t.reduce((t,a)=>Object(p.a)(Object(p.a)({},t),{},{[a]:{id:a,provider:e}}),{});s=Object(p.a)(Object(p.a)({},s),r)},i=0,n=Object.keys(a);i<n.length;i++)r();console.log(s),e.setState({strips:s});case 11:case"end":return t.stop()}}),t)})))()}}var f=e=>"video"===e.mediaType?r.a.createElement("video",e," "):r.a.createElement("img",Object.assign({alt:e.alt},e));class y extends s.Component{constructor(e){super(e),this.state={date:this.props.date||"",strips:{},shown:!0,id:this.props.id,name:void 0,provider:this.props.provider,mediaType:this.props.mediaType},this.mediaRef=r.a.createRef()}static getDerivedStateFromProps(e,t){return e.date!==t.date?{date:e.date}:null}componentDidMount(){this.state.id&&this.findUrl(this.state.date);try{this.mediaRef.current.play()}catch(e){}}componentDidUpdate(){this.findUrl();try{this.mediaRef.current.play()}catch(e){}}render(){var e=this.state.strips[this.state.date]||{};return console.log("mediaType",this.state.mediaType),""!==this.state.date&&this.state.id?e.url?r.a.createElement("div",{className:"comic-container"},r.a.createElement("h2",null," ",this.state.name," ")," ",r.a.createElement("p",null," ",this.state.date," ")," ",r.a.createElement("span",{role:"img","aria-label":"Delete",onClick:this.props.remove}," ","\u274c")," ",r.a.createElement("div",{className:"comic"},r.a.createElement("link",{ref:"previous",rel:"preload",as:"image",href:(this.state.strips[e.previous]||{}).url})," ",r.a.createElement(f,{ref:this.mediaRef,alt:this.state.name||this.state.id+" comic strip",src:e.url,mediaType:e.mediaType,autoplay:"autoplay",onLoad:function(){console.log("Loaded"),this.play()}})," ",r.a.createElement("link",{ref:"next",rel:"preload",as:"image",href:(this.state.strips[e.next]||{}).url})," ",r.a.createElement("div",{className:"overlay"},r.a.createElement("input",{type:"button",onClick:()=>this.props.setDate(e.previous),value:"",className:"arrow"}),r.a.createElement("input",{type:"button",onClick:()=>this.props.setDate(e.next),value:"",className:"arrow"}))," ")," "):null:r.a.createElement("div",{className:"input-container"},r.a.createElement(g,{updateValue:e=>{console.log("updateValue",e),this.props.updateVals({id:e.id,name:e.name,provider:e.provider})}})," ")}findUrl(e){var t=this;return Object(v.a)(h.a.mark((function a(){var s,r,i,n,o,l,p,d,m,u;return h.a.wrap((function(a){for(;;)switch(a.prev=a.next){case 0:if(t.state.id&&t.state.provider){a.next=2;break}return a.abrupt("return");case 2:if(t.state.id&&t.state.provider&&!t.state.name&&fetch("".concat(c,"/api/").concat("v1","/").concat(encodeURIComponent(t.state.provider),"/").concat(encodeURIComponent(t.state.id))).then(e=>e.json()).then(e=>t.setState({name:e.name})),e=e||t.state.date,r={},Object.keys(t.state.strips).includes(e)){a.next=17;break}return i=t.getUrl(e),a.next=9,fetch(i);case 9:return n=a.sent,a.next=12,n.json();case 12:(n=a.sent)&&!n.error||console.log(i,"failed"),s=n||void 0,a.next=18;break;case 17:s=t.state.strips[e];case 18:r[e]=s||void 0,t.state.date!==e&&t.setState({date:e,strips:r}),o=0,l=["previous","next"];case 21:if(!(o<l.length)){a.next=44;break}if(p=l[o],t.state.strips[s[p]]||!s[p]||""===s[p]){a.next=40;break}return d=t.getUrl(s[p]),a.next=27,fetch(d);case 27:return m=a.sent,a.prev=28,a.next=31,m.json();case 31:m=a.sent,a.next=37;break;case 34:return a.prev=34,a.t0=a.catch(28),a.abrupt("continue",41);case 37:r[s[p]]=m||void 0,a.next=41;break;case 40:r[s[p]]=t.state.strips[s[p]];case 41:o++,a.next=21;break;case 44:u=Object.keys(t.state.strips),Object.keys(r).filter(e=>!u.includes(e)).length>0&&t.setState({strips:r});case 46:case"end":return a.stop()}}),a,null,[[28,34]])})))()}getUrl(e){return"".concat(c,"/api/").concat("v1","/").concat(encodeURIComponent(this.state.provider),"/").concat(encodeURIComponent(this.state.id),"/").concat(e)}}class b extends s.Component{constructor(e){super(e);var t=new URLSearchParams(window.location.search);this.url=t,this.state={date:["year","month","day"].reduce((e,a)=>e||!t.get(a),!1)?new Date:new Date(t.get("year"),t.get("month")-1,t.get("day")),comics:[]};var a=(...e)=>e.reduce((e,t)=>e.slice(0,t.length).map((e,a)=>[e,t[a]])),s=a(t.getAll("comic"),t.getAll("provider"));s=(s=s.length>0?s:a(JSON.parse(o("comic")||"[]"),JSON.parse(o("provider")||"[]"))).length>0?s.map(e=>({id:e[0],provider:e[1]})):[{provider:"gocomics",id:"pearlsbeforeswine"},{provider:"dilbert",id:"dilbert"},{provider:"gocomics",id:"dilbert-classics"},{provider:"xkcd",id:"xkcd"},{provider:"smbc",id:"smbc"},{provider:"comicskingdom",id:"sherman-s-lagoon"},{provider:"comicskingdom",id:"dustin"},{provider:"comicskingdom",id:"rhymes-with-orange"},{provider:"gocomics",id:"lio"},{provider:"gocomics",id:"calvinandhobbes"},{provider:"gocomics",id:"foxtrot"},{provider:"gocomics",id:"garfield"}],this.state.comics=s;var r=m()(this.state.date).format("YYYY/M/D");document.title=m()(this.state.date).format("MMMM D[, ]YYYY");var i=this.state.comics.map(e=>Object(p.a)(Object(p.a)({},e),{},{date:r}));this.state.comics=i,"true"===t.get("sync")&&this.setURL(this.state.comics,this.state.date,!0)}render(){return r.a.createElement("div",{className:"App"},r.a.createElement("div",{className:"navBar"},r.a.createElement("button",{onClick:()=>this.addDays(-1),className:"changeDate"},"& lt;"," ")," ",r.a.createElement("h1",{className:"title"}," Cartoon Curator ")," ",r.a.createElement("button",{onClick:()=>this.addDays(1),className:"changeDate next"},"& gt;"," ")," ")," ",r.a.createElement("div",{className:"body"}," ",this.state.comics.map((e,t)=>r.a.createElement(y,{updateVals:e=>this.updateValue(t,e),remove:()=>this.popComic(t),setDate:e=>this.setDate(t,e),key:e.id,date:e.date,id:e.id,provider:e.provider,mediaType:e.mediaType}))," ",r.a.createElement("div",{className:"input-container"},r.a.createElement("input",{type:"button",onClick:()=>this.addComic(),className:"plus",value:"+"}))," ")," ")}addComic(){this.setState({comics:[...this.state.comics,{id:"",name:"",date:m()(this.state.date).format("YYYY/M/D")}]})}updateValue(e,t){var a=[...this.state.comics];a[e]=Object.assign({},a[e],t),this.setURL(a),this.setState({comics:a})}setDate(e,t){var a=[...this.state.comics],s=Object(p.a)({},a[e]);s.date=t,a[e]=s,this.setState({comics:a})}popComic(e){var t=[...this.state.comics],a=t.splice(e,1);return this.setState({comics:t}),this.setURL(t),a}addDays(e){var t=new Date(this.state.date);t.setDate(this.state.date.getDate()+e),this.applyDate(t)}applyDate(e){var t=m()(e).format("YYYY/M/D"),a=this.state.comics.map(e=>Object(p.a)(Object(p.a)({},e),{},{date:t}));this.setURL(void 0,t),this.setState({date:e,comics:a})}setURL(e,t=this.state.date,a=!1){var s=m()(t);if(e){if(this.url.delete("comic"),this.url.delete("provider"),a){var r,i=Object(l.a)(e);try{for(i.s();!(r=i.n()).done;){var n=r.value;this.url.append("comic",n.id),this.url.append("provider",n.provider)}}catch(c){i.e(c)}finally{i.f()}}[["id","comic"],["provider","provider"]].forEach(([t,a])=>{document.cookie=a+"="+escape(JSON.stringify(e.map(e=>e[t])))})}if(t){[["year","YYYY"],["month","M"],["day","D"]].forEach(([e,t])=>{var a=s.format(t);this.url.set(e,a),document.cookie="".concat(e,"=").concat(a)})}window.history.pushState(t,m()(t).format("MMMM D[,] YYYY"),"?"+this.url.toString())}}a(361),a(362);var E=a(115);class x extends r.a.Component{constructor(e){document.title="Editor",super(e),this.state={currJson:{id:"",name:"","series-ids":["YYYY-MM-DD"],"date-scrape":[],"extremes-scrape":{first:[],last:[]},"get-name":[],"src-to-url":"${src}","list-names":[]},password:"",output:{},apiUrl:c+"/api/v1/"};var t=new URLSearchParams(window.location.search).get("edit");t&&fetch(c+"/api/v1/"+t).then(e=>e.text()).then(e=>this.setState({currJson:JSON.parse(e.replaceAll("\\\\","\\\\\\\\"))}))}copyToClipboard(){navigator.clipboard.writeText(JSON.stringify(this.state.currJson,null))}render(){var e={style:{outerBox:{flexGrow:"1",height:"100%"},container:{width:"100%",height:"100%"}},theme:"light_mitsuketa_tribute"};return r.a.createElement("div",{className:"Editor"},"Password:"," ",r.a.createElement("input",{type:"password",size:"50",value:this.state.password,onChange:e=>this.setState({password:e.target.value})}," ")," ",r.a.createElement("br",null),"API URL:"," ",r.a.createElement("input",{type:"text",size:"50",value:this.state.apiUrl,onChange:e=>this.setState({apiUrl:e.target.value})}," ")," ",r.a.createElement("br",null),"Query Path:"," ",r.a.createElement("input",{type:"text",size:"50",value:this.state.query,onChange:e=>this.setState({query:e.target.value})}," ")," ",r.a.createElement("input",{type:"button",value:"Test",onClick:()=>this.runJSON()})," ",r.a.createElement("br",null),r.a.createElement("input",{type:"button",value:"Copy to Clipboard",onClick:()=>this.copyToClipboard()})," ",r.a.createElement("div",{className:"textarea-holder"},r.a.createElement(E.a,Object.assign({placeholder:this.state.currJson,onChange:e=>{this.state.tempJson=e.jsObject,this.state.tempStr=e.json}},e))," ",r.a.createElement("img",{className:"sample-image",src:this.state.output.url,style:{maxWidth:"49vw",height:"auto"}})," ",r.a.createElement(E.a,Object.assign({readOnly:!0,placeholder:this.state.output},e)),">"," ")," ",r.a.createElement("br",null))}runJSON(){var e=this;return Object(v.a)(h.a.mark((function t(){var a,s;return h.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,a=e.state.tempJson||e.state.currJson,e.setState({currJson:e.state.tempStr&&JSON.parse(e.state.tempStr.replaceAll("\\\\","\\\\\\\\"))||e.state.tempJson}),t.next=5,fetch(e.state.apiUrl+"provider",{method:"POST",mode:"cors",headers:{"Content-Type":"application/json"},body:JSON.stringify({json:a,password:e.state.password})});case 5:return t.next=7,t.sent.json();case 7:return t.sent,t.next=10,fetch(e.state.apiUrl+e.state.query);case 10:return t.next=12,t.sent.json();case 12:s=t.sent,e.setState({output:s||{}}),t.next=19;break;case 16:t.prev=16,t.t0=t.catch(0),alert(t.t0.message);case 19:case"end":return t.stop()}}),t,null,[[0,16]])})))()}}var k=x,w=a(160),S=a(42);class O extends s.Component{render(){return r.a.createElement(w.a,null,r.a.createElement(S.c,null,r.a.createElement(S.a,{path:"/editor"},r.a.createElement(k,null))," ",r.a.createElement(S.a,{path:"/"},r.a.createElement(b,null))," ")," ")}}var j=O;n.a.render(r.a.createElement(j,null),document.getElementById("root"))}},[[164,1,2]]]);
//# sourceMappingURL=main.5ea82e7c.chunk.js.map
