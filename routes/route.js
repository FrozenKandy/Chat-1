var express     =  require("express") ;
var router      =  express.Router() ;
var middleware  =  require("../middleware");
var User        =  require("../models/user");
var passport    =  require("passport");
var List        =  require("../models/list");

var filter = {};


router.get("/" , function(req,res){
  res.render("landing");
});


// authentication routes



router.get("/login" , function(req,res){
  res.render("login");
});

router.get("/register" , function(req,res){
  res.render("register");
});

router.post("/register" , function(req,res){
  var newUser = new User({ username : req.body.username});
  User.register(newUser , req.body.password , function(err , user){
    if(err){
      console.log(err);
      res.redirect("/register");
    }else{
      passport.authenticate("local")(req,res,function(){
      console.log("Registered");
      res.redirect("/");
    })
    }
  });
});

router.post("/login", passport.authenticate("local", {
  successRedirect : "/" ,
  failureRedirect : "/login"
}), function(req,res){
});

router.get("/logout", function(req,res){
  req.logout();
  res.redirect("/");
});

///  display routes


router.get("/:id", middleware.isLoggedIn, function(req,res) {
    User.findById(req.params.id).populate("list").exec(function(err,foundUser){
      if(err){
        console.log(err);
      }else {
        res.render("main" , { user : foundUser });
      }
    });
});

router.post("/:id/new" , middleware.isLoggedIn, function(req,res){
  User.findById(req.params.id , function(err, foundUser){
    if(err){
      console.log(err);
    }else {
        List.create(filter , function(err, lt){
        lt.item = req.body.newitem ;
        lt.completed = 0;
        lt.save();
        foundUser.list.push(lt);
        foundUser.save();
        res.redirect("/" + foundUser._id);
      });
    }
  });
});

router.get("/:id/:list_id/del" , middleware.isLoggedIn, function(req,res){
  List.findByIdAndRemove(req.params.list_id , function(err){
    if(err){
      console.log(err);
    }else {
      res.redirect("/" + req.params.id);
    }
  });
});

router.get("/:id/:list_id/completed" , middleware.isLoggedIn , function(req,res){
   List.findById(req.params.list_id , function(err , foundList ){
     if(err){
       console.log(err);
     }else {
       if(foundList.completed == 0){
         foundList.completed = 1;
         foundList.save();
       }
       else{
         foundList.completed = 0;
         foundList.save();
       }
       res.redirect("/" + req.params.id);
     }
   });
});




module.exports = router ;
