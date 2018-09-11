var passport = require('passport');
var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var Account = new mongoose.Schema({
    username: String,
    password: String
});

Account.methods.validPassword = function( pwd ) {
    return ( this.password === pwd );
};

Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('Account', Account);