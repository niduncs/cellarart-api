var module = module.exports = {};

module.connect = function (connectionString) {
    var mongoose = require('mongoose');
    mongoose.Promise = require('bluebird');
    mongoose.connect(connectionString);
};
