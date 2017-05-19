var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EventSchema = new Schema({
    name: { type: String, required: true },
    date: {
        startDate: String,
        endDate: String
    },
    location: String,
    url: String,
    type: String
});

module.exports = mongoose.model('Event', EventSchema);
