const {Schema}=require("mongoose");
const ObjectId=Schema.Types.ObjectId;
const days=new Schema({
    imageId:{
        type:String,
        required:[true,"Every day needs an Image ID"]
    },
    next:ObjectId,
    previous:ObjectId
});

const loadDependencies=(comics)=>{
    days.add({
        comic:{
            type:ObjectId,
            ref:'Publisher'
        }
    });
};

module.exports={schema:days,loadDependencies,name:"Day"};