var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

//ROOT ROUTE
router.get("/", function(req, res){
    res.render("landing");
});

//show register form
router.get("/register", function(req, res){
    res.render("register");
});

//handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            //can put err b/c it will say what is wrong, it is COMING FROM PASSPORT
            req.flash("error", err);
            //short circuts to get out of entire callback
            return res.render("register", {"error": err.message});
        } 
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to YelpCamp " + user.username + "!");
            res.redirect("/campgrounds"); 
        });
    });
});

//show login form
router.get("/login", function(req, res){
    res.render("login"); 
});
//handling login logic
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res){
        //just serving as middleware model
});
//logout route
    //ezpz
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/campgrounds");
});


module.exports = router;