var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SiteContentSchema = new Schema({
    artistStatement:String,
    aboutMe:String
});

module.exports = mongoose.model('SiteContent', SiteContentSchema);