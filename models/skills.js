const { string } = require("joi");
const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const skillSchema=new Schema(
    {
        userId:{
            type:String,
        },
        username:{
            type:String,
        },
        // email:{
        //     type:String,
        //     required:true,
        // },
        college:{
            type:String,
        },
        phone:{
            type:Number,
            min:999999999,
            max:10000000000,
            
        },
        keywords:
        [
            {
                type:String,
            }
        ],
        keywords2:
        [
            {
                type:String,
            }
        ],
    }
)

const Skills=new mongoose.model("Skills",skillSchema);
module.exports=Skills;
