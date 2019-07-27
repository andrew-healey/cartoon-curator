const {Schema}=require("mongoose");
const ObjectId=Schema.Types.ObjectId;
const comics=new Schema({
    name:String,
    id:{
        type:String,
        required:[true,"A comic requires an id"]
    },
});

const loadDependencies=(providers,days)=>{
    comics.add({
        provider:{
            type:ObjectId,
            ref:'Provider'
        },
    });
};
module.exports={schema:comics,loadDependencies,name:"Comic"};