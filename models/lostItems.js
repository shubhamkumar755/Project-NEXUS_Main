const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const lostUser=new Schema(
    {
        userId:{
            type:String,
        },
        lostDate:Date,
        createdAt:{
            type:Date,
            default:Date.now()
        },
        time:{
            type:String,
        },
        location:
        {
            type:String,
        },
        // geometry:{//mongodb has a special type to store geocode  
        //     type:{
        //         type:String,
        //         enum:['Point'],
        //         required:true
        //     },
        //     coordinates:{
        //         type:[Number],
        //         required:true
        //     }
        // },
        keywords:
        {
            type:String,
        },
        keywords2:
        {
            type:String,
        },
        color:{
            type:String,
        },
        brand:{
            type:String,
        },
        description:
        {
            type:String,
        },
    }
)

const LostItem=new mongoose.model("LostItem",lostUser);
module.exports=LostItem;
