var mongoose = require('mongoose');

var departementSchema = new mongoose.Schema({
    
    id : Number,
    region_code : String,
    code : String,
    name : String,
    slug : String
    /*images : [
        
        {
            
            img : mongoose.Schema.Types.ObjectId,
            ref : 'Image'
            
        }
        
    ]*/
    
});

var Departement = mongoose.model('Ville', villeSchema);

module.exports = Departement;