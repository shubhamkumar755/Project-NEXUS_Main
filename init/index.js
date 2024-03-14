const mongoose=require("mongoose");
const initData=require("./data.js");

const mongoURL="mongodb://127.0.0.1:27017/l&f";
const Items=require("../models/items.js");

async function main(){
    await mongoose.connect(mongoURL);
}
main().then(()=>{
    console.log("connected");

}).catch((err)=>
{
    console.log(err);
})

const initDB=async()=>{
    await Items.deleteMany({});
    //initData.data=initData.data.map((obj)=>({...obj,owner:"65a261aab5bba57e3cb2c391"}));//using map we can access indivudual object in our listing inside the array
    await Items.insertMany(initData.data);
    console.log("data was initialized");
}
initDB();