const mongoose=require("mongoose");
const Promise=require("bluebird");
require('dotenv').load();

const db=mongoose.connect(process.env.DATABASE.replace(/<password>/,process.env.PASSWORD),{useNewUrlParser:true});

const provider=require("./provider");
const providers=provider.schema;
const comic=require("./comic");
const comics=comic.schema;
const day=require("./day");
const days=day.schema;

provider.loadDependencies();
comic.loadDependencies(providers);
day.loadDependencies(comics);

db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open',()=>{
    const [Provider,Comic,Day]=[provider,comic,day].map(i=>mongoose.model(i.name,i.schema));
});