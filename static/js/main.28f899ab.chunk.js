(this.webpackJsonprunner=this.webpackJsonprunner||[]).push([[0],{198:function(e,t,a){e.exports=a(487)},203:function(e,t,a){},481:function(e,t,a){},482:function(e,t,a){},487:function(e,t,a){"use strict";a.r(t);var n=a(1),r=a.n(n),s=a(194),i=a.n(s),c=(a(203),a(204),a(205),a(206),a(207),a(208),a(209),a(210),a(211),a(212),a(213),a(214),a(215),a(216),a(217),a(218),a(219),a(220),a(221),a(222),a(223),a(224),a(225),a(226),a(227),a(228),a(229),a(230),a(90),a(231),a(232),a(233),a(234),a(235),a(236),a(237),a(238),a(239),a(240),a(241),a(242),a(243),a(244),a(245),a(246),a(248),a(249),a(251),a(252),a(254),a(255),a(128),a(256),a(257),a(258),a(259),a(260),a(261),a(262),a(263),a(264),a(265),a(266),a(267),a(268),a(269),a(270),a(271),a(272),a(273),a(274),a(275),a(276),a(277),a(278),a(279),a(280),a(281),a(282),a(283),a(284),a(285),a(286),a(287),a(288),a(289),a(290),a(291),a(292),a(293),a(294),a(295),a(296),a(297),a(298),a(299),a(300),a(301),a(302),a(303),a(304),a(305),a(307),a(308),a(309),a(310),a(311),a(312),a(313),a(315),a(316),a(317),a(318),a(319),a(320),a(321),a(322),a(323),a(324),a(325),a(179),a(326),a(327),a(181),a(328),a(329),a(330),a(331),a(182),a(332),a(333),a(334),a(335),a(336),a(337),a(338),a(339),a(340),a(341),a(342),a(343),a(344),a(345),a(346),a(347),a(348),a(350),a(351),a(352),a(353),a(354),a(355),a(356),a(357),a(358),a(359),a(360),a(361),a(362),a(363),a(364),a(365),a(366),a(367),a(368),a(369),a(370),a(371),a(372),a(373),a(374),a(375),a(376),a(377),a(378),a(379),a(380),a(381),a(382),a(136),a(383),a(384),a(385),a(386),a(387),a(388),a(389),a(391),a(392),a(393),a(394),a(395),a(396),a(397),a(398),a(400),a(401),a(402),a(403),a(404),a(405),a(406),a(407),a(408),a(409),a(410),a(411),a(412),a(413),a(414),a(415),a(416),a(417),a(418),a(419),a(420),a(421),a(422),a(423),a(424),a(426),a(427),a(428),a(429),a(430),a(431),a(432),a(433),a(434),a(435),a(436),a(437),a(438),a(439),a(440),a(441),a(442),a(443),a(444),a(445),a(446),a(447),a(448),a(449),a(450),a(451),a(452),a(453),a(454),a(455),a(456),a(457),a(459),a(460),a(461),a(462),a(463),a(464),a(465),a(466),a(467),a(468),a(469),a(470),a(471),a(472),a(473),a(474),a(476),a(192),a(33)),o=a(34),u=a(36),l=a(35),p=a(37),d=window.location.origin.startsWith("http://localhost:")?"http://localhost:3000":"https://api.freecomics.ml";function m(e){return unescape(document.cookie.replace(new RegExp("(?:(?:^|.*;\\s*)"+e+"\\s*\\=\\s*([^;]*).*$)|^.*$"),"$1"))}a(477);var h=a(140),v=a(85),f=a(55),b=a(62),y=a.n(b),g=a(51),O=a.n(g),j=a(65),k=a(107),E=function(e){function t(e){var a;return Object(c.a)(this,t),(a=Object(u.a)(this,Object(l.a)(t).call(this,e))).state={strips:{Select:""}},a.findStrips(),a}return Object(p.a)(t,e),Object(o.a)(t,[{key:"render",value:function(){var e=this;return(r.a.createElement("select",{className:"comic-choice",onChange:function(t){return e.props.updateValue(Object(f.a)({name:t.target.value},e.state.strips[t.target.value]))}},Object.keys(this.state.strips).sort((function(e,t){return t>e})).map((function(e){return r.a.createElement("option",{key:e,value:e},e)}))))}},{key:"findStrips",value:function(){var e=Object(j.a)(O.a.mark((function e(){var t,a,n,r,s;return O.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch("".concat(d,"/api/").concat("v1","/ids"));case 2:return t=e.sent,e.next=5,t.json();case 5:for(t=e.sent,a={Select:[null,null]},n=function(){var e=s[r],n=t[e];console.log(n);var i=n.reduce((function(t,a){return Object(f.a)({},t,Object(k.a)({},a,{id:a,provider:e}))}),{});a=Object(f.a)({},a,{},i)},r=0,s=Object.keys(t);r<s.length;r++)n();console.log(a),this.setState({strips:a});case 11:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()}]),t}(n.Component),x=function(e){return"video"===e.mediaType?r.a.createElement("video",e):r.a.createElement("img",Object.assign({alt:e.alt},e))},w=function(e){function t(e){var a;return Object(c.a)(this,t),(a=Object(u.a)(this,Object(l.a)(t).call(this,e))).state={date:a.props.date||"",strips:{},shown:!0,id:a.props.id,name:void 0,provider:a.props.provider,mediaType:a.props.mediaType},a}return Object(p.a)(t,e),Object(o.a)(t,[{key:"componentDidMount",value:function(){this.state.id&&this.findUrl(this.state.date)}},{key:"componentDidUpdate",value:function(){this.findUrl()}},{key:"render",value:function(){var e=this,t=this.state.strips[this.state.date]||{};return console.log("mediaType",this.state.mediaType),""!==this.state.date&&this.state.id?t.url?r.a.createElement("div",{className:"comic-container"},r.a.createElement("h2",null,this.state.name),r.a.createElement("p",null,this.state.date),r.a.createElement("span",{role:"img","aria-label":"Delete",onClick:this.props.remove},"\u274c"),r.a.createElement("div",{className:"comic"},r.a.createElement("link",{ref:"previous",rel:"preload",as:"image",href:(this.state.strips[t.previous]||{}).url}),r.a.createElement(x,{ref:"this",alt:this.state.name||this.state.id+" comic strip",src:t.url,mediaType:t.mediaType,autoplay:"autoplay",onload:function(){this.play()}}),r.a.createElement("link",{ref:"next",rel:"preload",as:"image",href:(this.state.strips[t.next]||{}).url}),r.a.createElement("div",{className:"overlay"},r.a.createElement("input",{type:"button",onClick:function(){return e.props.setDate(t.previous)},value:"",className:"arrow"}),r.a.createElement("input",{type:"button",onClick:function(){return e.props.setDate(t.next)},value:"",className:"arrow"})))):null:r.a.createElement("div",{className:"input-container"},r.a.createElement(E,{updateValue:function(t){console.log("updateValue",t),e.props.updateVals({id:t.id,name:t.name,provider:t.provider})}}))}},{key:"findUrl",value:function(){var e=Object(j.a)(O.a.mark((function e(t){var a,n,r,s,i,c,o,u,l,p,m=this;return O.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(this.state.id&&this.state.provider){e.next=2;break}return e.abrupt("return");case 2:if(this.state.id&&this.state.provider&&!this.state.name&&fetch("".concat(d,"/api/").concat("v1","/").concat(encodeURIComponent(this.state.provider),"/").concat(encodeURIComponent(this.state.id))).then((function(e){return e.json()})).then((function(e){return m.setState({name:e.name})})),t=t||this.state.date,n={},Object.keys(this.state.strips).includes(t)){e.next=17;break}return r=this.getUrl(t),e.next=9,fetch(r);case 9:return s=e.sent,e.next=12,s.json();case 12:(s=e.sent)&&!s.error||console.log(r,"failed"),a=s||void 0,e.next=18;break;case 17:a=this.state.strips[t];case 18:n[t]=a||void 0,this.state.date!==t&&this.setState({date:t,strips:n}),i=0,c=["previous","next"];case 21:if(!(i<c.length)){e.next=44;break}if(o=c[i],this.state.strips[a[o]]||!a[o]||""===a[o]){e.next=40;break}return u=this.getUrl(a[o]),e.next=27,fetch(u);case 27:return l=e.sent,e.prev=28,e.next=31,l.json();case 31:l=e.sent,e.next=37;break;case 34:return e.prev=34,e.t0=e.catch(28),e.abrupt("continue",41);case 37:n[a[o]]=l||void 0,e.next=41;break;case 40:n[a[o]]=this.state.strips[a[o]];case 41:i++,e.next=21;break;case 44:p=Object.keys(this.state.strips),Object.keys(n).filter((function(e){return!p.includes(e)})).length>0&&this.setState({strips:n});case 46:case"end":return e.stop()}}),e,this,[[28,34]])})));return function(t){return e.apply(this,arguments)}}()},{key:"getUrl",value:function(e){return"".concat(d,"/api/").concat("v1","/").concat(encodeURIComponent(this.state.provider),"/").concat(encodeURIComponent(this.state.id),"/").concat(e)}}],[{key:"getDerivedStateFromProps",value:function(e,t){return e.date!==t.date?{date:e.date}:null}}]),t}(n.Component),S=function(e){function t(e){var a;Object(c.a)(this,t),a=Object(u.a)(this,Object(l.a)(t).call(this,e));var n=new URLSearchParams(window.location.search);a.url=n,a.state={date:["year","month","day"].reduce((function(e,t){return e||!n.get(t)}),!1)?new Date:new Date(n.get("year"),n.get("month")-1,n.get("day")),comics:[]};var r=function(){for(var e=arguments.length,t=new Array(e),a=0;a<e;a++)t[a]=arguments[a];return t.reduce((function(e,t){return e.slice(0,t.length).map((function(e,a){return[e,t[a]]}))}))},s=r(n.getAll("comic"),n.getAll("provider"));s=(s=s.length>0?s:r(JSON.parse(m("comic")||"[]"),JSON.parse(m("provider")||"[]"))).length>0?s.map((function(e){return{id:e[0],provider:e[1]}})):[{provider:"gocomics",id:"pearlsbeforeswine"},{provider:"dilbert",id:"dilbert"},{provider:"gocomics",id:"dilbert-classics"},{provider:"xkcd",id:"xkcd"},{provider:"smbc",id:"smbc"},{provider:"comicskingdom",id:"sherman-s-lagoon"},{provider:"comicskingdom",id:"dustin"},{provider:"comicskingdom",id:"rhymes-with-orange"},{provider:"gocomics",id:"lio"},{provider:"gocomics",id:"calvinandhobbes"},{provider:"gocomics",id:"foxtrot"},{provider:"gocomics",id:"garfield"}],a.state.comics=s;var i=y()(a.state.date).format("YYYY/M/D");document.title=y()(a.state.date).format("MMMM D[, ]YYYY");var o=a.state.comics.map((function(e){return Object(f.a)({},e,{date:i})}));return a.state.comics=o,"true"===n.get("sync")&&a.setURL(a.state.comics,a.state.date,!0),a}return Object(p.a)(t,e),Object(o.a)(t,[{key:"render",value:function(){var e=this;return(r.a.createElement("div",{className:"App"},r.a.createElement("div",{className:"navBar"},r.a.createElement("button",{onClick:function(){return e.addDays(-1)},className:"changeDate"},"<"),r.a.createElement("h1",{className:"title"},"Cartoon Curator"),r.a.createElement("button",{onClick:function(){return e.addDays(1)},className:"changeDate next"},">")),r.a.createElement("div",{className:"body"},this.state.comics.map((function(t,a){return r.a.createElement(w,{updateVals:function(t){return e.updateValue(a,t)},remove:function(){return e.popComic(a)},setDate:function(t){return e.setDate(a,t)},key:t.id,date:t.date,id:t.id,provider:t.provider,mediaType:t.mediaType})})),r.a.createElement("div",{className:"input-container"},r.a.createElement("input",{type:"button",onClick:function(){return e.addComic()},className:"plus",value:"+"})))))}},{key:"addComic",value:function(){this.setState({comics:[].concat(Object(v.a)(this.state.comics),[{id:"",name:"",date:y()(this.state.date).format("YYYY/M/D")}])})}},{key:"updateValue",value:function(e,t){var a=Object(v.a)(this.state.comics);a[e]=Object.assign({},a[e],t),this.setURL(a),this.setState({comics:a})}},{key:"setDate",value:function(e,t){var a=Object(v.a)(this.state.comics),n=Object(f.a)({},a[e]);n.date=t,a[e]=n,this.setState({comics:a})}},{key:"popComic",value:function(e){var t=Object(v.a)(this.state.comics),a=t.splice(e,1);return this.setState({comics:t}),this.setURL(t),a}},{key:"addDays",value:function(e){var t=new Date(this.state.date);t.setDate(this.state.date.getDate()+e),this.applyDate(t)}},{key:"applyDate",value:function(e){var t=y()(e).format("YYYY/M/D"),a=this.state.comics.map((function(e){return Object(f.a)({},e,{date:t})}));this.setURL(void 0,t),this.setState({date:e,comics:a})}},{key:"setURL",value:function(e){var t=this,a=arguments.length>1&&void 0!==arguments[1]?arguments[1]:this.state.date,n=arguments.length>2&&void 0!==arguments[2]&&arguments[2],r=y()(a);if(e){if(this.url.delete("comic"),this.url.delete("provider"),n){var s=!0,i=!1,c=void 0;try{for(var o,u=e[Symbol.iterator]();!(s=(o=u.next()).done);s=!0){var l=o.value;this.url.append("comic",l.id),this.url.append("provider",l.provider)}}catch(d){i=!0,c=d}finally{try{s||null==u.return||u.return()}finally{if(i)throw c}}}[["id","comic"],["provider","provider"]].forEach((function(t){var a=Object(h.a)(t,2),n=a[0],r=a[1];document.cookie=r+"="+escape(JSON.stringify(e.map((function(e){return e[n]}))))}))}if(a){var p=[["year","YYYY"],["month","M"],["day","D"]];p.forEach((function(e){var a=Object(h.a)(e,2),n=a[0],s=a[1],i=r.format(s);t.url.set(n,i),document.cookie="".concat(n,"=").concat(i)}))}window.history.pushState(a,y()(a).format("MMMM D[,] YYYY"),"?"+this.url.toString())}}]),t}(n.Component),C=(a(481),a(482),a(139)),D=function(e){function t(e){var a;Object(c.a)(this,t),document.title="Editor",(a=Object(u.a)(this,Object(l.a)(t).call(this,e))).state={currJson:{id:"",name:"","series-ids":["YYYY-MM-DD"],"date-scrape":[],"extremes-scrape":{first:[],last:[]},"get-name":[],"src-to-url":"${src}","list-names":[]},password:"",output:{},apiUrl:d+"/api/v1/"};var n=new URLSearchParams(window.location.search).get("edit");return n&&fetch(d+"/api/v1/"+n).then((function(e){return e.text()})).then((function(e){return a.setState({currJson:JSON.parse(e.replaceAll("\\\\","\\\\\\\\"))})})),a}return Object(p.a)(t,e),Object(o.a)(t,[{key:"copyToClipboard",value:function(){navigator.clipboard.writeText(JSON.stringify(this.state.currJson,null))}},{key:"render",value:function(){var e=this,t={style:{outerBox:{flexGrow:"1",height:"100%"},container:{width:"100%",height:"100%"}},theme:"light_mitsuketa_tribute"};return r.a.createElement("div",{className:"Editor"},"Password: ",r.a.createElement("input",{type:"password",size:"50",value:this.state.password,onChange:function(t){return e.setState({password:t.target.value})}}),r.a.createElement("br",null),"API URL: ",r.a.createElement("input",{type:"text",size:"50",value:this.state.apiUrl,onChange:function(t){return e.setState({apiUrl:t.target.value})}}),r.a.createElement("br",null),"Query Path: ",r.a.createElement("input",{type:"text",size:"50",value:this.state.query,onChange:function(t){return e.setState({query:t.target.value})}}),r.a.createElement("input",{type:"button",value:"Test",onClick:function(){return e.runJSON()}}),r.a.createElement("br",null),r.a.createElement("input",{type:"button",value:"Copy to Clipboard",onClick:function(){return e.copyToClipboard()}}),r.a.createElement("div",{className:"textarea-holder"},r.a.createElement(C.a,Object.assign({placeholder:this.state.currJson,onChange:function(t){e.state.tempJson=t.jsObject,e.state.tempStr=t.json}},t)),r.a.createElement("img",{className:"sample-image",src:this.state.output.url,style:{maxWidth:"49vw",height:"auto"}}),r.a.createElement(C.a,Object.assign({readOnly:!0,placeholder:this.state.output},t)),">"),r.a.createElement("br",null))}},{key:"runJSON",value:function(){var e=Object(j.a)(O.a.mark((function e(){var t,a;return O.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,t=this.state.tempJson||this.state.currJson,this.setState({currJson:this.state.tempStr&&JSON.parse(this.state.tempStr.replaceAll("\\\\","\\\\\\\\"))||this.state.tempJson}),e.next=5,fetch(this.state.apiUrl+"provider",{method:"POST",mode:"cors",headers:{"Content-Type":"application/json"},body:JSON.stringify({json:t,password:this.state.password})});case 5:return e.next=7,e.sent.json();case 7:return e.sent,e.next=10,fetch(this.state.apiUrl+this.state.query);case 10:return e.next=12,e.sent.json();case 12:a=e.sent,this.setState({output:a||{}}),e.next=19;break;case 16:e.prev=16,e.t0=e.catch(0),alert(e.t0.message);case 19:case"end":return e.stop()}}),e,this,[[0,16]])})));return function(){return e.apply(this,arguments)}}()}]),t}(r.a.Component),Y=a(195),N=a(54),U=function(e){function t(){return Object(c.a)(this,t),Object(u.a)(this,Object(l.a)(t).apply(this,arguments))}return Object(p.a)(t,e),Object(o.a)(t,[{key:"render",value:function(){return r.a.createElement(Y.a,null,r.a.createElement(N.c,null,r.a.createElement(N.a,{path:"/editor"},r.a.createElement(D,null)),r.a.createElement(N.a,{path:"/"},r.a.createElement(S,null))))}}]),t}(n.Component);i.a.render(r.a.createElement(U,null),document.getElementById("root"))}},[[198,1,2]]]);
//# sourceMappingURL=main.28f899ab.chunk.js.map