var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EventSchema = new Schema({
    name: String,
    date: Date,
    location: String,
    url: String,
    type: String
});

module.exports = mongoose.model('Event', EventSchema);
