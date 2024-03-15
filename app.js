if(process.env.NODE_ENV !="production");{
    require("dotenv").config();//to save .env file we must run "npm install --save dotenv "
}
const express=require("express");
const app=express();
const path=require("path"); 
const ejsMate=require("ejs-mate");
const mongoose=require("mongoose");
const Items=require("./models/foundItems.js");
const lostUser=require("./models/lostItems.js");
const Skills=require("./models/skills.js");
const { itemSchema } = require("./schema.js");
const mongoURL="mongodb://127.0.0.1:27017/l&f";
const Atlas_URL=process.env.Mongo_Atlas;
var passport = require('passport');
var LocalStrategy = require('passport-local');
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressErrors=require("./utils/ExpressErrors.js");
const session=require("express-session");
const MongoStore=require("connect-mongo");
const flash=require("connect-flash");
const User=require("./models/user.js");
const {isLoggedIn,saveRedirectUrl}=require("./middleware.js");
const multer  = require('multer')//multer helps to parse the file format for images , as till now we just used to use urlencoded type parsing which is used for json 
const {storage}=require("./cloudConfig.js");
const upload = multer({storage}) 
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });
const {vitMap,code}=require("./public/js/vitMap.js");

async function main(){
    await mongoose.connect(Atlas_URL);
}
main().then(()=>{
        console.log("connected");
}).catch((err)=>{
        console.log(err);
})

const store=MongoStore.create({
    mongoUrl:Atlas_URL,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
});

store.on("error",()=>{
    console.log("ERROR in MONGO SESSION STORE",err);
});

const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000, //we are setting a time after which the cookie will get expire ie after 7 days (we need to set in milliseconds therefore we converted days to millisecond)
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }
};


app.set("view engine" , "ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));// this is one of the middlewares i.e{express.urlencoded}
app.use(express.static(path.join(__dirname,"/public")));
app.engine("ejs",ejsMate);




app.use(session(sessionOptions));//creating express-session 
app.use(flash());//we need to use flash before we write our routes
app.use(passport.initialize());//passport also uses session so that we dont need to login again and again 
app.use(passport.session());//this helps us in identifying when the same user is trying to login after some time 
passport.use(new LocalStrategy(User.authenticate()));//here user.authenticate means user ko sign in karana 
passport.serializeUser(User.serializeUser());//serialze means to store all the information relatede to the user 
passport.deserializeUser(User.deserializeUser());//to remove all the info related to user means deserializeing

//middleware defied for LOCALS
//*locals are such variables which are accessible everywhere 
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user; //using req.user we get the information wheather the user is logged in or not as it return undefined when user is not looged in and return an object with username and email when logged in 
    //we can access locals anywhere in the code so we define here what we use in varible we need to use in different parts 
    next();
});

app.get("/login&signup",(req,res)=>{
    res.render("index1.ejs");
}) 

app.get("/",isLoggedIn,(req,res)=>{
    res.render("index2.ejs");
})
app.get("/lost&found",(req,res)=>{
    res.render("./listing/show.ejs")
})
//FOUND
app.get("/found",isLoggedIn,(req,res)=>{
    
        res.render("./listing/found.ejs");
})
app.post("/found", isLoggedIn,upload.single('obj[image]'),async(req,res,next)=>{
    if(!req.body.obj){
        console.log(req.body.obj);
    }
    let response=await geocodingClient.forwardGeocode({
        query: req.body.obj.location,
        limit: 1
      }).send();
    let url=req.file.path;
    let filename=req.file.filename; 
    let user2=req.session.passport.user;
    let obj2=await User.find({username:user2});
    req.body.obj.phone=obj2[0].phone;
    let newItems=new Items(req.body.obj);
    newItems.image={url,filename};
    response.body.features[0].geometry.coordinates=code(req.body.obj.location);
    newItems.geometry=response.body.features[0].geometry;
    let save=await newItems.save();
    req.flash("success","The concerned person will contact you soon :)")
    res.redirect("/");
})


//LOST
app.get("/lost",isLoggedIn,async(req,res)=>{
    
    
    if(req.session.passport===undefined)
    {
        req.flash("error","You Must be Logged in !");
        res.redirect("/");
    } 
    else{
        res.render("./listing/lost.ejs");
    }
})
app.post("/lost",isLoggedIn,async(req,res,next)=>{
    if(!req.body.obj){
        console.log(req.body.obj);
    }
    let userReq=req.body.obj.keywords;
    let user=req.session.passport.user;
    let obj1=await User.find({username:user});
    req.body.obj.userId=obj1[0]._id.toString();
    let newUser=new lostUser(req.body.obj);
    // const newUser2=new lostUser({userId:j});
    // let url=req.file.path;
    // let filename=req.file.filename;
    // newItems.image={url,filename};
    let save=await newUser.save();
    // await newUser2.save();
    res.redirect("/result/-2");
})

//RESULT
app.get("/result/:id",isLoggedIn,async(req,res)=>{
    let {id}=req.params;
    let found=await Items.find({});
    let user=req.session.passport.user;
    
    let obj1=await User.find({username:user});
    
    let l=await lostUser.find({ userId:obj1[0]._id.toString()});
    let lost;
    
    if(id==-2)
    {
        lost=l[l.length-1];
    }
    else
    {
        lost=l[id];
    }
    let sum=0;
    res.render("./listing/result.ejs",{found,lost,sum});
})
app.get("/result2/:id",isLoggedIn,async(req,res)=>{
    let {id}=req.params;
    let obj=await Items.findById(id);
    res.render("./listing/result2.ejs",{obj})
})


//SIGNUP&LOGIN
app.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
});
app.post("/signup",async(req,res)=>{
    try{
        let {username,email,phone,password}=req.body;
        let newUser=new User({email,phone,username});
        let registeredUser=await User.register(newUser,password);//here hello world is the password which it will save in  db after salting and hashing and fakeuser is the userid which it will automatically search in db for non matching ids
        //console.log(registeredUser);//as soon as we singup it needs to directly login so we created the login session of passport 
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to Lost and Found!");
            return res.redirect("/");
        });
        req.flash("success","welcome to Lost and Found !");
        
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
})
app.get("/login",(req,res)=>{
    res.render("users/login.ejs");
})
app.post("/login",saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),async(req,res,next)=>{
    //pass.auth authenticate the pass and it does using a middleware
    //failureflash means if the authetification failes the we will get a falsh message 
    req.flash("welcome to Lost & Found ! you are logged in");
    let redirectUrl=res.locals.redirectUrl || "/"; //means if res.locals.redirecturl exists the use that otherwise the value becomes 
    res.redirect(redirectUrl);//here passport will create a problem as when we login ,  passport will reset the session and so the stored url will get deleted therfore we save this url in locals as it can be accessed from anywhere
})
app.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you are logged out!");
        res.redirect("/login&signup");//.logout() takes callback as a parameter means as soon as the user gets loged out then what task is to be performed is to be told in the form of a funtion 
    });
})

//ACCOUNT
app.get("/account",isLoggedIn,async(req,res)=>{
    let user=req.session.passport.user;
    let obj1=await User.find({username:user});

    let losts=await lostUser.find({ userId:obj1[0]._id.toString()});
    
    res.render("./listing/account",{obj1,losts});

})


//Skills
app.get("/skills",isLoggedIn,(req,res)=>{
    res.render("./listing2/skills_show.ejs");
})
app.post("/skills",isLoggedIn,async(req,res)=>{
    if(!req.body.obj){
        console.log(req.body.obj);
    }
    let user=req.session.passport.user;
    let obj1=await User.find({username:user});
    req.body.obj.userId=obj1[0]._id.toString();
    let newUser=new Skills(req.body.obj);
    newUser.username=obj1[0].username;
    let save=await newUser.save();
    let allSkills=await Skills.find({});
    res.render("./listing2/skills_result.ejs",{allSkills,obj1});
})
app.post("/skills_search",isLoggedIn,(req,res)=>{
    let {category1,category2}=req.body;
    console.log(category1);
    res.redirect("/");
})

//express middleware which deals with errors
app.use((err,req,res,next)=>{
    let{statusCode=500,message="something went wrong"}=err;
    res.status(statusCode).render("error.ejs",{message});
    // res.status(statusCode).send(message);
})

app.listen("3000",()=>{
    console.log("listening to port");
})

