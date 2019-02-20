var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
    //can leave just like this b/c index.js is a special name that shouldn't be manual written in, express npm has a file named it 
var middleware = require("../middleware");

// INDEX - show all campgrounds
router.get("/", function(req, res){
    //GET ALL CAMPGROUNDS FROM DB
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        }else{
            //doesnt need the / in the beginning for odd reason?
                //CURRENTUSER: REQ.USER IMPORTANT FOR LATER ON, user info
            res.render("campgrounds/index", {campgrounds:allCampgrounds, currentUser: req.user});
        }
    });
});

// CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    //get data from form and add to campgrounds array 
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name: name, price: price, image: image, description: desc, author: author};
    //Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        }else{
            //redirect back to campgrounds page
            req.flash("success", "Your campground has been created!");
            res.redirect("/campgrounds");
        }
    });
});

//NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});


// SHOW - shows info about one campground
router.get("/:id", function(req, res){
    //Find the campground with provided ID 
        //populating w/ comments and then executing it 
            //NEVER FORGET TO PUT THE PARATHESIS AFTER EXEC
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        }else{
            //Render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
    req.params.id;
});

//reeee

/*
//EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});
*/

// EDIT - shows edit form for a campground
router.get("/:id/edit", middleware.isLoggedIn, middleware.checkCampgroundOwnership, function(req, res){
  //render edit template with that campground
  res.render("campgrounds/edit", {campground: req.campground});
});


//UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    //find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        }else{
            //cannot do _id :id b/c won't be recognized
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds");
        }
    }); 
});

module.exports = router;