var express = require("express");
var router = express.Router();
var passport = require("passport");
var flash = require("connect-flash");


var express = require("express");
var router = express.Router();

// homepage route
router.get('/', function (req, res, next) {
    res.render('home.ejs');
});

module.exports = router;