var express = require("express");
    //merging params is important
var router = express.Router({mergeParams:true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
    //can leave just like this b/c index.js is a special name that shouldn't be manual written in, express npm has a file named it 
var middleware = require("../middleware");

//Comments new
router.get("/new", middleware.isLoggedIn,function(req, res){
    //find campground by id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new", {campground: campground});
        }
    });
});

//Comments create
    //isLoggedIn prevents anybody from adding a comment unless logged in 
        //could send request through postman or anything similar
router.post("/", middleware.isLoggedIn, function(req, res){
    //lookup campground using id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            req.flash("error", "Something went wrong, please report!");
            res.redirect("/campgrounds");
        }else{
            //CAN REQUEST INSTANTLY NOW B/C OF DOING "name="comment[author]" AND SO ON
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                }else{
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success", "Successfully added comment!");
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
    //create new comment
    //connect new comment to campground
    //redirect campground showpage
});

/*
//EDITING COMMENT 
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
       if(err){
           res.redirect("back");
       }else{
           res.render("comments/edit", {campground_id: req.params.id, comment: foundComment}); 
       }
    });
});
*/

//EDITING
router.get("/:comment_id/edit", middleware.isLoggedIn, middleware.checkCommentOwnership, function(req, res){
  res.render("comments/edit", {campground_id: req.params.id, comment: req.comment});
});

// COMMENT UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//COMMENT DESTROY 
router.delete("/:comment_id", middleware.checkCommentOwnership,function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        }else{
            req.flash("success", "Comment deleted!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

module.exports = router;