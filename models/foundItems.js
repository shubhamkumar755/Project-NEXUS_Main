const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const itemSchema=new Schema(
    {
        image:
        {
            url:String,
            filename:String,
        },
        phone:{
            type:Number,
            min:999999999,
            max:10000000000,
            
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
        geometry:{//mongodb has a special type to store geocode  
            type:{
                type:String,
                enum:['Point'],
                required:true
            },
            coordinates:{
                type:[Number],
                required:true
            }
        },
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

const FoundItems=new mongoose.model("FoundItems",itemSchema);
module.exports=FoundItems;
