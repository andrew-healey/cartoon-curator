(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{13:function(t,e,a){t.exports=a(25)},19:function(t,e,a){},22:function(t,e,a){t.exports=a.p+"static/media/logo.5d5d9eef.svg"},24:function(t,e,a){},25:function(t,e,a){"use strict";a.r(e);var n=a(0),s=a.n(n),r=a(12),i=a.n(r),c=(a(19),a(2)),o=a.n(c),l=a(10),u=a(9),p=a(7),h=a(3),m=a(4),d=a(6),f=a(5),b=a(8),v=(a(22),a(1)),k=a.n(v),j=(a(24),function(t){function e(){return Object(h.a)(this,e),Object(d.a)(this,Object(f.a)(e).apply(this,arguments))}return Object(b.a)(e,t),Object(m.a)(e,[{key:"render",value:function(){return s.a.createElement(g,null)}}]),e}(n.Component)),g=function(t){function e(t){var a;Object(h.a)(this,e),(a=Object(d.a)(this,Object(f.a)(e).call(this,t))).state={date:"/"==window.location.pathname?new Date:new Date(window.location.pathname.substr(1)),comics:[{id:"pearlsbeforeswine",name:"Pearls Before Swine"},{id:"dilbert-classics",name:"Dilbert Classics"},{id:"lio",name:"Lio"},{id:"calvinandhobbes",name:"Calvin and Hobbes"},{id:"foxtrot",name:"Foxtrot"},{id:"dilbert",name:"Dilbert"},{id:"garfield",name:"Garfield"}]};var n=k()(a.state.date).format("YYYY/MM/DD");document.title=k()(a.state.date).format("MMMM D[, ]YYYY");var s=a.state.comics.map(function(t){return Object(p.a)({},t,{date:n})});return a.state.comics=s,a}return Object(b.a)(e,t),Object(m.a)(e,[{key:"render",value:function(){var t=this;return s.a.createElement(s.a.Fragment,null,s.a.createElement("button",{onClick:function(){return t.addDays(-1)},className:"changeDate"},"<"),s.a.createElement("button",{onClick:function(){return t.addDays(1)},className:"changeDate next"},">"),s.a.createElement("div",{className:"App"},this.state.comics.map(function(e,a){return s.a.createElement(y,{remove:function(){return t.popComic(a)},setDate:function(e){return t.setDate(a,e)},key:e.id,date:e.date,id:e.id,name:e.name})}),s.a.createElement("div",{className:"input-container"},s.a.createElement("input",{type:"button",onClick:function(){return t.addComic()},className:"plus",value:"+"}))))}},{key:"addComic",value:function(){this.setState({comics:[].concat(Object(u.a)(this.state.comics),[{id:"",name:"",date:k()(this.state.date).format("YYYY/MM/DD")}])})}},{key:"setDate",value:function(t,e){var a=Object(u.a)(this.state.comics),n=Object(p.a)({},a[t]);n.date=e.replace(/\/[^\/]*\/(.*)$/g,"$1"),a[t]=n,this.setState({comics:a})}},{key:"popComic",value:function(t){var e=Object(u.a)(this.state.comics),a=e.splice(t,1);return this.setState({comics:e}),a}},{key:"addDays",value:function(t){var e=new Date(this.state.date);e.setDate(this.state.date.getDate()+t),this.state.date=e,this.applyDate(k()(e).format("YYYY/MM/DD"))}},{key:"applyDate",value:function(t){var e=this.state.comics.map(function(e){return Object(p.a)({},e,{date:t})});document.title=k()(t).format("MMMM D[, ]YYYY"),window.history.pushState(t,k()(t).format("MMMM D[,] YYYY"),"/"+t),this.setState({comics:e})}}]),e}(n.Component),y=function(t){function e(t){var a;return Object(h.a)(this,e),(a=Object(d.a)(this,Object(f.a)(e).call(this,t))).date=a.props.date,a.state={path:"",strips:{},shown:!0,id:a.props.id,name:a.props.name},a.state.id&&(a.state.path=a.getPath(),a.findUrl(a.state.path)),a}return Object(b.a)(e,t),Object(m.a)(e,[{key:"render",value:function(){var t=this;this.date=this.props.date,this.state.path=this.getPath(),console.log(this.state.path);var e=this.state.strips[this.state.path]||{};return this.findUrl(this.state.path),""!==this.state.path&&this.state.id?e.url?s.a.createElement("div",{className:"comic-container"},s.a.createElement("h2",null,this.state.name),s.a.createElement("p",null,this.state.path.replace(/^\/[^\/]+\/(.*)$/g,"$1")),s.a.createElement("span",{onClick:this.props.remove},"\u274c"),s.a.createElement("span",{className:"comic"},s.a.createElement("input",{type:"button",onClick:function(){return t.findUrl(e.previous)},value:"\u2190",className:"arrow"}),s.a.createElement("img",{ref:"next",style:{display:"none"},src:(this.state.strips[e.previous]||{}).url,onClick:function(){return t.findUrl(e.previous)}}),s.a.createElement("span",null,s.a.createElement("img",{ref:"this",src:e.url,onClick:function(){return t.findUrl(e.previous)}})),s.a.createElement("img",{ref:"last",style:{display:"none"},src:(this.state.strips[e.next]||{}).url,onClick:function(){return t.findUrl(e.previous)}}),s.a.createElement("input",{type:"button",onClick:function(){return t.findUrl(e.next)},value:"\u2192",className:"arrow"}))):null:s.a.createElement("div",{className:"input-container"},s.a.createElement(O,{updateValue:function(e){t.state.id=e.id,t.state.name=e.name,t.state.path=t.getPath(),t.findUrl()}}))}},{key:"findUrl",value:function(){var t=Object(l.a)(o.a.mark(function t(e){var a,n,s,r,i,c,l,u,p,h;return o.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:if(e=e||this.getPath(),n={},console.log("Finding",e),Math.random(),Object.keys(this.state.strips).includes(e)){t.next=21;break}return s="https://Comic-Strip-API.426729.repl.co/api".concat(e),console.log("trying",s),t.next=9,fetch(s);case 9:return r=t.sent,console.log("Got response"),t.next=13,r.json();case 13:if(r=t.sent,console.log("Awaited"),!r.error){t.next=17;break}return t.abrupt("return",console.log(s,"failed"));case 17:a=r,console.log(r),t.next=23;break;case 21:console.log("Cached",e),a=this.state.strips[e];case 23:n[e]=a,this.state.path!==e&&this.props.setDate(e),i=0,c=["previous","next"];case 26:if(!(i<c.length)){t.next=49;break}if(l=c[i],this.state.strips[a[l]]||!a[l]||""===a[l]){t.next=45;break}return u="https://Comic-Strip-API.426729.repl.co/api".concat(a[l]),t.next=32,fetch(u);case 32:return p=t.sent,t.prev=33,t.next=36,p.json();case 36:p=t.sent,t.next=42;break;case 39:return t.prev=39,t.t0=t.catch(33),t.abrupt("continue",46);case 42:n[a[l]]=p,t.next=46;break;case 45:n[a[l]]=this.state.strips[a[l]];case 46:i++,t.next=26;break;case 49:h=Object.keys(this.state.strips),Object.keys(n).filter(function(t){return!h.includes(t)}).length>0&&this.setState({strips:n});case 51:case"end":return t.stop()}},t,this,[[33,39]])}));return function(e){return t.apply(this,arguments)}}()},{key:"getPath",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this.date;return console.log(this.date),"/".concat(this.state.id,"/").concat(t)}}]),e}(n.Component),O=function(t){function e(t){var a;return Object(h.a)(this,e),(a=Object(d.a)(this,Object(f.a)(e).call(this,t))).state={strips:{Select:""}},a.findStrips(),a}return Object(b.a)(e,t),Object(m.a)(e,[{key:"render",value:function(){var t=this;return s.a.createElement("select",{className:"comic-choice",onChange:function(e){return t.props.updateValue({name:e.target.value,id:t.state.strips[e.target.value]})}},Object.keys(this.state.strips).map(function(t){return s.a.createElement("option",{value:t},t)}))}},{key:"findStrips",value:function(){var t=Object(l.a)(o.a.mark(function t(){var e,a,n,s,r;return o.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,fetch("https://comic-strip-api.426729.repl.co/ids");case 2:return e=t.sent,t.next=5,e.json();case 5:for(e=t.sent,a={Select:""},n=0,s=Object.keys(e);n<s.length;n++)r=s[n],a=Object(p.a)({},a,e[r]);this.setState({strips:a});case 9:case"end":return t.stop()}},t,this)}));return function(){return t.apply(this,arguments)}}()}]),e}(n.Component),D=j;i.a.render(s.a.createElement(D,null),document.getElementById("root"))}},[[13,1,2]]]);
//# sourceMappingURL=main.cd58554a.chunk.js.map