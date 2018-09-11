var mongoose = require('mongoose');

var commentaireSchema = new mongoose.Schema({
    
    title : String,
    username : String,
    date : String,
    content : String,
    insee_code : String,
    date2 : Date //sert pour le tri par date
    
});

var Commentaire = mongoose.model('Commentaire', commentaireSchema);

module.exports = Commentaire;