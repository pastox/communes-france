var mongoose = require('mongoose');

var villeSchema = new mongoose.Schema({
    
    id : Number,
    department_code : String,
    insee_code : String,
    zip_code : String,
    name : String,
    slug : String,
    gps_lat : Number,
    gps_lng : Number
    
});

var Ville = mongoose.model('Ville', villeSchema);

module.exports = Ville;