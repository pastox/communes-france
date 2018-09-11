var express = require('express');
var mongoose = require('mongoose');
var nunjucks = require('nunjucks');
var bodyParser = require('body-parser');
var multer = require('multer');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var Account = require('./models/Account');
var Ville = require('./models/Ville');

//Configuration du multer(notamment pour la récupération des images avatar fournies par les utilisateurs dans les commentaires)
var upload = multer({
    
    dest : __dirname + '/uploads'
    
});

//Connexion à la base de données
mongoose.connect("mongodb://pastox:rugby+drums5@ds125272.mlab.com:25272/communes-france");

var app = express();

//Informations sur les sessions des utilisateurs
app.use(session({
    cookieName: 'session',
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));

//Initialisation de passport pour l'authentification
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

app.use(bodyParser.urlencoded({extended : false}));
//quand un élément du formulaire avec l'id file est envoyé, cet élément est automatiquement enregistré dans le dossier uploads
app.use(upload.single('file'));

//définition des raccourcis pour accéder à des fichiers statiques
app.use('/css', express.static( __dirname + "/node_modules/bootstrap/dist/css"));
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use('/scripts', express.static(__dirname + '/scripts'));

//Configuration du système de templates
nunjucks.configure('views', {
    
    autoescape : true,
    express : app
    
});

//Direction des routes vers les routers
app.use('/', require('./routes/villes'));
app.use('/authentification', require('./routes/authentification'));

console.log("Application Villes_de_France lancée sur le port 3001");

app.listen(80);