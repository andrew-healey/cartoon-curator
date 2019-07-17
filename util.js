const {assert}=require("chai");
const flatObject=json=>Object.keys(json).reduce((last,next)=>({...last,...(typeof json[next]==="object"?flatObject(json[next]):{[next]:json[next]})}),{})
const filterByKeys=(keys,obj)=>keys.reduce((last,next)=>({...last,[next]:obj[next]}),{});
const contains=(obj1,obj2,strict=false)=>assert[`deep${strict?"Strict":""}Equal`](obj1,filterByKeys(Object.keys(obj1),obj2));

module.exports= {flatObject,filterByKeys,contains};