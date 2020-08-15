var express        =  require('express'),
    app            =  express(),
    LocalStrategy  =  require("passport-local"),
    methodOverride =  require("method-override"),
    flash          =  require("connect-flash"),
    bodyParser     =  require("body-parser"),
    mongoose       =  require("mongoose"),
    passport       =  require("passport"),
    User           =  require("./models/user");


var todoListRoute = require("./routes/route");

app.use(methodOverride("_method"));

mongoose.connect("mongodb://localhost:27017/todo_list3" , {useNewUrlParser: true ,  useUnifiedTopology: true});
app.use(bodyParser.urlencoded({extended : true}));
app.set("view engine" , "ejs");
app.use(express.static("public"));

app.use(require("express-session")({
  secret : "QWERT" ,
  resave : false ,
  saveUninitialized : false
}));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// send information about user to all route stored in req.user

app.use(function(req,res,next){
  res.locals.currentUser = req.user;
  res.locals.error       = req.flash("error");
  res.locals.success     = req.flash("success");
  next();
});

app.use(todoListRoute);


app.listen(processenv.PORT , function () {
	console.log("Server has started");
});
