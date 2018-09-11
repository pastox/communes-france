var express = require('express');
var router = express.Router();
var passport = require('passport');
var Account = require('./../models/Account.js');
var Ville = require('./../models/Ville.js');
var Commentaire = require('./../models/Commentaire.js');
var Image = require('./../models/Image.js')
var moment = require('moment');
var https = require('https');

router.get('/', function(req, res){
    
    Commentaire.find({insee_code : ''}).then(function(commentaires){
        res.render('villes/index.html', {message : "Nom de la ville  -  Sélectionner dans la liste d'autocomplétion  -  Ne pas écrire trop vite", user : req.user, commentaires : commentaires}); 
    })    

});

router.get('/autocompletion/:morceau', function(req, res){
    
    Ville.find({$or: [{slug : {$regex : (req.params.morceau.toLowerCase()+'.*')}}, {name : {$regex : ('(?i)' + req.params.morceau+'.*')}}]}).sort({slug : 1}).then(function(villes){

        res.jsonp(villes);        

    });
    
});

router.get('/:insee_code', function(req, res){
    
   Ville.findOne({insee_code : req.params.insee_code}).then(function(ville){
       
       Commentaire.find({insee_code : req.params.insee_code}).sort({date2 : -1}).then(function(commentaires){
           
           Image.find({insee_code : req.params.insee_code}).sort({date2 : -1}).then(function(images){
               
               var request = https.get("https://www.prevision-meteo.ch/services/json/lat="+ ville.gps_lat + "lng=" + ville.gps_lng, function(response){
                   
                    //récupération des données
                    var body = "";
                    var dataObj;
                    response.on("data", function(chunk){

                        body += chunk;

                    });

                    response.on("end", function(){

                        try{
                            
                            dataObj = JSON.parse(body);
                            
                            res.render('villes/show.html', {ville : ville, commentaires : commentaires, images : images, user : req.user, meteo : dataObj});

                        } catch(error) {

                            console.log(error);

                        }

                    });
                   
               });
               
           })
           
       })  
       
   }) 
    
});

router.post('/', function(req, res){
        
    Ville.findOne({name : req.body.name.slice(0,req.body.name.length-5), department_code : req.body.name.slice(req.body.name.length-3,req.body.name.length-1)}).then(function(ville){
        
        if(ville){return ville} else{return Promise.reject()};
        
    }).then(function(ville){
        
        res.redirect('/'+ville.insee_code);
        
    }).catch(function(){
        
        Commentaire.find({insee_code : ''}).then(function(commentaires){
        res.render('villes/index.html', {message : "Cette ville n'existe pas  -  Sélectionner dans la liste d'autocomplétion  -  Ne pas écrire trop vite", user : req.user, commentaires : commentaires}); 
        })
        
    });
    
});

router.post('/comment', function(req, res){
    
    if (req.user != null){
        
        var commentaire = new Commentaire();
        commentaire.username = req.user.username;
        commentaire.title = req.body.title;
        commentaire.date = moment().format('MMMM Do YYYY, h:mm:ss a');
        commentaire.content = req.body.content;
        commentaire.insee_code = '';
        commentaire.date2 = new Date();
        commentaire.save();
        res.redirect('/');
        
    } else {
        
        res.redirect('/authentification/login');
        
    }
    
});

router.post('/:insee_code/comment', function(req, res){
    
    if (req.user != null){
        
        var commentaire = new Commentaire();
        commentaire.username = req.user.username;
        commentaire.title = req.body.title;
        commentaire.date = moment().format('MMMM Do YYYY, h:mm:ss a');
        commentaire.content = req.body.content;
        commentaire.insee_code = req.params.insee_code;
        commentaire.date2 = new Date();
        commentaire.save();
        res.redirect('/'+req.params.insee_code);
        
    } else {
        
        res.redirect('/authentification/login');
        
    }
    
})

router.post('/:insee_code/image', function(req, res){
    
    if (req.user != null){
        var image = new Image();
        image.insee_code = req.params.insee_code;
        image.file = req.file.filename;
        image.username = req.user.username;
        image.date = moment().format('MMMM Do YYYY, h:mm:ss a');
        image.date2 = new Date();
        image.save();
        res.redirect('/'+req.params.insee_code);
    } else {
        
        res.redirect('/authentification/login')
        
    }
    
})

module.exports = router;