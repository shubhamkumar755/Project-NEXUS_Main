
const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const passportLocalMongoose=require("passport-local-mongoose");

const userSchema=new Schema({
    email:{
        type:String,
        required:true,
    },
    phone:{
        type:Number,
        min:999999999,
        max:10000000000,
        required:true,
    },
    college:{
        type:String,
    }
    //here we have not declared the schema for user id but if we directly declare the userid while making a user then it will automatiicaly create a schema for user id
})

userSchema.plugin(passportLocalMongoose); //we used passportLocalMongoose as a plugin because it automatically implements/creats username , does salting and also does hashing and hash password for us
                                         //additionaly it adds methods which we can use with schema to authenticate our password and many more
module.exports=mongoose.model("User",userSchema);