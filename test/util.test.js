const assert=require("assert");
// import assert from 'assert';
const {flatObject}=require("../util");
// import {flatObject} from '../util';
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