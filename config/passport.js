//aqui se encuentra el middleware de passport el cual utilizamos para hacer la validacion de los inicios de sesion y registros
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');

//serialize and deserialize 
passport.serializeUser(function(user,done){
    done(null,user._id);
});

passport.deserializeUser(function(id,done){
    User.findById(id, function(err,user){
        done(err,user);
    });
});


//middleware
passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
    }, function(req, email, password, done){
        User.findOne({email:email}, function(err,user){
            if(err) return done(err);
            if(!user) return(null, false, req.flash('loginMessage','No user has been found'));
            if(!user.passwordVerification(password)) return done(null,false,req.flash('loginMessage','Incorrect Password'));
            return done(null,user);
        })
    }))

//validation function
exports.isAuthenticated = function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    else {
        res.redirect('/login');
    }
}