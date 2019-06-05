const express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    localStrategy = require("passport-local"),
    flash = require("connect-flash");

//connect to mongoose
mongoose.connect('mongodb://localhost:27017/beatboxx', {
    useNewUrlParser: true
});

app.use(bodyParser.urlencoded({
    extended: true;
}));

app.set("view-engine", "ejs");
app.use(express.static(__dirname + "/public"));

//passport config
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    next();
})