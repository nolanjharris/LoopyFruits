var express = require("express");
var router = express.Router();
var passport = require("passport");
var flash = require("connect-flash");


var express = require("express");
var router = express.Router();

// homepage route
router.get('/producer', function (req, res, next) {
    res.render('loopyFruits.ejs');
});

module.exports = router;