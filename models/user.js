var mongoose             = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
   username: String, 
   password: String
});

//adds methods
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);