const request = require("request-promise");
const cheerio = require("cheerio");
const moment=require("moment");

const infoFinders={
  dilbert:{
    getDate:async (id, year, month, day)=>{
      let date=`${year}-${month}-${day}`;
      let url=`https://dilbert.com/strip/${date}`;
      let html=await request(url);
      // console.log("Yay! Got url",url);
      let $=cheerio.load(html);
      let img=$("meta[property='og:image']");
      let previous=$("i.fa.fa-caret-left");
      let next=$("i.fa.fa-caret-right");
      if(!img) return {error:true};
      let hash=img.attr("content").replace(/^.+(.{32})$/,"$1");
      let changeDate=i=>i?i.replace(/^.+\/(\d+)-(\d+)-(\d+)$/g,"/"+id+"/$1/$2/$3"):"";
      let ret={url:`https://assets.amuniversal.com/${hash}`,hash,previous:changeDate(previous.parent().attr("href")),next:changeDate(next.parent().attr("href")),id,year,month,day,first:"",last:""};
      return ret;
    },
    getExtremes:async ()=>{
      let url="https://www.dilbert.com/";
      let html=await request(url);
      let $=cheerio.load(html);
      let img=$("img.img-responsive.img-comic");
      return ["1989/04/16",img.attr("href").replace(/(\d+)-(\d+)-(\d+)/,"$1/$2/$3")];
    }
  },

  gocomics:{
    proxy:undefined,
    getDate:async (id, year, month, day)=>{
      let path=`${id}/${year}/${month}/${day}`;
      let url = `https://www.gocomics.com/${path}`;
      let html = await request(url,{proxy:infoFinders.gocomics.proxy}).catch(err=>console.log(err.message));
      let $ = cheerio.load(html);
      let err = $("div.alert.alert-dismissible.fade.show.gc-alert.gc-alert--warning.js-gc-alert");
      let image = $("meta[property='og:image']");
      let previous = $("a.fa.btn.btn-outline-secondary.btn-circle.fa-caret-left.sm.js-previous-comic");
      let next = $("a.fa.btn.btn-outline-secondary.btn-circle.fa-caret-right.sm");
      let first = $("a.fa.btn.btn-outline-secondary.btn-circle.fa.fa-backward.sm");
      let last = $("a.fa.btn.btn-outline-secondary.btn-circle.fa-forward.sm");
      let hash=image.attr("content");
      if (!image||!hash){
        return {error: true};
      }
      hash=hash.substr(31);
      let ret={
        previous: previous.attr("href"),
        next: next.attr("href"),
        first: first.attr("href"),
        last: last.attr("href"),
        url: `https://assets.amuniversal.com/${hash}`,
        hash,
        id,
        year,
        month,
        day
      };
      return ret;
    },
    getExtremes:async (id)=>{
      let extractDate=(url)=>url.replace(/(\d+)\/(\d+)\/(\d+)/,"$1/$2/$3")
      const domain="https://www.gocomics.com";
      let url=`${domain}/${id}/`;
      console.log(url);
      let html=await request(url,{proxy:infoFinders.gocomics.proxy}).catch(err=>console.log(err.message));
      let $=cheerio.load(html);
      let button=$("div.row div a.gc-blended-link.gc-blended-link--primary");
      url=domain+button.attr("href");
      let extremes=[extractDate(url)];
      html=await request(url,{proxy:infoFinders.gocomics.proxy}).catch(err=>console.log(err.message));
      $=cheerio.load(html);
      button=$("a.fa.btn.btn-outline-secondary.btn-circle.fa.fa-backward.sm");
      url=button.attr("href");
      extremes.push(extractDate(url));
      return extremes;
    }
  },

  comicskingdom:{
    getDate:async (url, year, month, day)=>{
      month=moment(month).format("MMMM");
      // console.log("hmm",month);
      day=parseInt(day).toString();
      let date=`${month}-${day}-${year}`;
      let reqUrl=`http://${url}/comics/${date}`;
      let html=await request(reqUrl);
      let $=cheerio.load(html);
      let img=$("article div p img");
      // console.log(img.attr("src"),reqUrl);
      let next=$("li#nextcomic a[rel='next']");
      let first=$("li#firstcomic a");
      let last=$("li#lastcomic a");
      let previous=$("li#previouscomic a[rel='prev']");
      let getPath=i=>i&&i.attr("href")?`/${url}/${moment(i.attr("href").replace(/^.+([a-zA-Z]+)-(\d)+-(\d)+$/g,`$1-$2-$3`)).format("YYYY/MM/DD")}`:undefined;
      let ret={
        url:img.attr("src"),next:getPath(next),first:getPath(first),last:getPath(last),previous:getPath(previous),id:url,year,month,day
      };
      return ret;
    },
    getExtremes:async ()=>{
        return [];
    }
  }
};

module.exports=infoFinders;