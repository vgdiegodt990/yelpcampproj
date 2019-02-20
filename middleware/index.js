var Campground = require("../models/campground");
var Comment = require("../models/comment");

//ALL MIDDLEWARE GOES THERE
//defining as object and then putting in functions
var middlewareObj = {};

/*
middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                req.flash("error", "Campground not found!");
                res.redirect("back");
            }else{
                //does user own comment?
                    //CAREFUL, FIRST ONE IS A MONGOOSE OBJECT WHILE ID IS A STRING
                        //.equals circumvents the issue
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash("error", "You don't have permission to do that!");
                    res.redirect("back");
                }
            }
        });
    }else{
        req.flash("error", "You need to be logged in to do that!");
        //back takes user back from where they came from
        res.redirect("back");
    }
};
*/


middlewareObj.checkCommentOwnership = function(req, res, next){
    Comment.findById(req.params.commentId, function(err, foundComment){
       if(err || !foundComment){
           console.log(err);
           req.flash('error', 'Sorry, that comment does not exist!');
           res.redirect('/campgrounds');
       } else if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin){
            req.comment = foundComment;
            next();
       } else {
           req.flash('error', 'You don\'t have permission to do that!');
           res.redirect('/campgrounds/' + req.params.id);
       }
    });
  };

middlewareObj.checkCampgroundOwnership = function(req, res, next){
    Campground.findById(req.params.id, function(err, foundCampground){
      if(err || !foundCampground){
          console.log(err);
          req.flash('error', 'Sorry, that campground does not exist!');
          res.redirect('/campgrounds');
      } else if(foundCampground.author.id.equals(req.user._id) || req.user.isAdmin){
          req.campground = foundCampground;
          next();
      } else {
          req.flash('error', 'You don\'t have permission to do that!');
          res.redirect('/campgrounds/' + req.params.id);
      }
    });
  };

/*
middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                res.redirect("back");
            }else{
                //does user own campground?
                    //CAREFUL, FIRST ONE IS A MONGOOSE OBJECT WHILE ID IS A STRING
                        //.equals circumvents the issue
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash("error", "You do not have permission to do that!");
                    res.redirect("back");
                }
            }
        });
    }else{
        req.flash("error", "You need to be logged in!");
        //back takes user back from where they came from
        res.redirect("back");
    }
};
*/

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();   
    }
    //just adding flash doesn't display anything, gives capability
    req.flash("error", "You need to be logged in to do that!");
    res.redirect("/login");  
};

module.exports = middlewareObj;