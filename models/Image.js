var mongoose = require('mongoose');

var imageSchema = new mongoose.Schema({
    
    insee_code : String,
    file : String,
    username : String,
    date : String,
    date2 : Date
    
});

var Image = mongoose.model('Image', imageSchema);

module.exports = Image;