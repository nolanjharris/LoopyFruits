var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    localStrategy = require("passport-local"),
    flash = require("connect-flash");

var indexRoutes = require("./routes/index");
var producerRoutes = require("./routes/producer");

//connect to mongoose
mongoose.connect('mongodb://localhost:27017/loopyfruits', {
    useNewUrlParser: true
});

app.use(bodyParser.urlencoded({
    extended: true
}));

// app.set('views', path.join(__dirname, 'views'));
// app.engine('html', require('ejs').renderFile);
// app.set('view engine', 'html');
app.set("view-engine", "ejs");
app.use(express.static(__dirname + "/public"));

//passport config
// app.use(passport.initialize());
// app.use(passport.session());
// passport.use(new localStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    next();
});

app.use(indexRoutes);
app.use(producerRoutes);


app.listen(process.env.PORT || 3000);
console.log('Running on ' + (process.env.PORT || 'localHost') + ".......");