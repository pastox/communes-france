var express = require('express');
var router = express.Router();
var passport = require('passport');
var session = require('express-session');
var passportLocal = require('passport-local');
var Account = require('./../models/Account.js');

//Création de compte
router.get('/register', function(req, res) {
    if ( req.user != null ) {
        res.redirect('/');
    } else {
        res.render('authentification/register.html', {
            title : 'Créez un compte',
            user : req.user,
            url : req.query.url
        });
    }
});

router.post('/register', function(req, res, next) {
    Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
    if (err) {
      return res.render('authentification/register.html', { error : err.message });
    }

    passport.authenticate('local')(req, res, function () {
      req.session.save(function (err) {
        if (err) {
          return next(err);
        }
        res.redirect(req.body.url);
      });
    });
    });
});

router.get('/login', function(req, res) {
  if ( req.user != null ) {
    res.redirect('back');
  } else {
      res.render('authentification/login.html', {
      user : req.user,
      title : 'Connectez-vous',
      url : req.query.url,
      });
  }
});

router.get('/login/err', function(req, res) {
  if ( req.user != null ) {
    res.redirect('back');
  } else {
      res.render('authentification/login.html', {
      user : req.user,
      title : 'Connectez-vous',
      url : req.query.url,
      message : 'Le pseudo ou le mot de passe est incorrect'
      });
  }
});

router.post('/login', function(req, res, next) {
  passport.authenticate('local', {}, function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.redirect('/authentification/login/err?url='+req.body.url); }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.redirect(req.body.url);
    });
  })(req, res, next);
});
    
router.get('/logout', function(req, res) {
    if ( req.user != null ) {
            req.logout();
            res.redirect('back');
    }
    else {
        res.redirect('back')
    }
});

module.exports = router;

