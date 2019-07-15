const {app}=require("./app");

const port=process.env.PORT||3000;
app.listen(port,()=>console.log(`Server started; listening on port ${port}`));
module.exports={port};