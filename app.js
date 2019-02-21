var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    Campground      = require("./models/campground"),
    /*
    seedDB          = require("./seeds"),
    */
    Comment         = require("./models/comment"),
    User            = require("./models/user"),
    methodOverride  = require("method-override"),
    flash           = require("connect-flash");

//requiring routes
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index");

//seeding the DB
//seedDB();
mongoose.connect('mongodb://localhost:27017/yelp_camp', { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
    //refers to directory that script is running
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

mongoose.connect("mongodb+srv://vghd800:pienerd029@yelpcamp-ophdt.mongodb.net/test?retryWrites=true");

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Nice",
    resave: false, 
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//MIDDLEWARE OFR NAV LOGIN LOGOUT SIGN UP LOGIC
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    //flash message
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(indexRoutes);
    //"/campgrounds" cleans up code in the routes file, makes it so every / starts with it 
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

//STAR
app.get("*", function(req, res){
    res.render("campgrounds/star");
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server has started."); 
});