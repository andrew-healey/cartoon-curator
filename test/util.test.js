const assert=require("assert");
const {flatObject}=require("../util");
describe("flatObject",()=>{
    it("returns leaf nodes of object",()=>
        assert.deepEqual({
            "hey":"hi",
            "hum":"ahoy"
        },flatObject({
            "hey":"hi",
            "hm":{
                "hum":"ahoy"
            }
        }))
    );
});