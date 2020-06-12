// rutas del usuario 
var router = require("express").Router();
var User = require("../models/user");
var passport = require("passport");
var passportConfig = require("../config/passport");
var async = require("async");
var Cart = require("../models/cart");

router.get("/login", function (req, res) {
  if (req.user) return res.redirect("/");
  res.render("accounts/login", { message: req.flash("loginMessage") });
});

router.post(
  "/login",
  passport.authenticate("local-login", {
    successRedirect: "/profile",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

router.get('/profile', passportConfig.isAuthenticated, function(req, res, next) {
    User
      .findOne({ _id: req.user._id })
      .populate('history.item')
      .exec(function(err, foundUser) {
        if (err) return next(err);
  
        res.render('accounts/profile', { user: foundUser });
      });
});

router.get("/signup", function (req, res, next) {
  res.render("accounts/signup", {
    errors: req.flash("errors"),
  });
});

router.post("/signup", function (req, res) {
  async.waterfall([
    function (callback) {
      var user = new User();
      user.profile.name = req.body.name;
      user.email = req.body.email;
      user.password = req.body.password;

      User.findOne({ email: req.body.email }, function (err, existingUser) {
        if (existingUser) {
          req.flash("errors", "Cuenta ya existe con este email");
          return res.redirect("/signup");
        } else {
          user.save(function (err, user) {
            if (err) {
              return next(err);
            } else {
              callback(null, user);
            }
          });
        }
      });
    },
    function (user) {
        var cart = new Cart();
        cart.user = user._id;
        cart.save(function(err){
            if(err) return next(err);
            req.logIn(user, function (err) {
                if (err) return next(err);
                res.redirect("/profile");
            });
        });
    },
  ]);
});

router.get("/logout", function (req, res, next) {
  req.logOut();
  res.redirect("/");
});

router.get("/edit-profile", function (req, res, next) {
  res.render("accounts/edit-profile", { message: req.flash("success") });
});

router.post("/edit-profile", function (req, res, next) {
  User.findOne({ _id: req.user._id }, function (err, user) {
    if (err) return next(err);
    if (req.body.name) user.profile.name = req.body.name;
    if (req.body.address) user.address = req.body.address;

    user.save(function (err) {
      if (err) {
        return next(err);
      } else {
        req.flash("success", "Successfully Edited Profile");
        return res.redirect("/edit-profile");
      }
    });
  });
});

module.exports = router;
