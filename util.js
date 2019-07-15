const flatObject=json=>Object.keys(json).reduce((last,next)=>({...last,...(typeof json[next]==="object"?flatObject(json[next]):{[next]:json[next]})}),{})

module.exports= {flatObject};    