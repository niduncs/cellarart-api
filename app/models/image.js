var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ImageSchema = new Schema({
    url: String,
    name: String,
    description: String
});

module.exports = mongoose.model('Image', ImageSchema);