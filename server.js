// external libraries
const express = require('express');
var app = express();
const bodyParser = require('body-parser');

// db connections and stuff
const connectionString = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/niall';
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect(connectionString);

// internal helper classes
const dateHelpers = require('./app/helpers/date-helpers');

// data models
const Event = require('./app/models/event');

// little bit of setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.PORT || 8080;
var router = express.Router();


// routing middleware
router.use(function (req, res, next) {
    next();
});

// the routing begins
// event stuff
router.route('/events')
    .get(function (req, res) {
        Event.find(function (err, events) {
            if (err)
                res.json({ success: false, message: err.message});

            if (events.length > 0)
                res.json(events);

            res.json({ success: true, message: 'No events to return!'});
        });
    })
    .post(function (req, res) {
        var event = new Event({
            name: req.params.name,
            location: req.params.location,
            date: req.params.date,
            url: req.params.url,
            type: dateHelpers.getDateType(req.params.date)
        });

        event.save(function (err) {
            if (err)
                res.json({ success: false, message: err.message});

            res.json({ success: !err });
        });
    });

router.route('/events/:event_id')
    .get(function (req, res) {
        Event.findById(req.params.event_id, function (err, event) {
            if (err)
                res.json({ 'success': false, 'message': err.message});

            res.json({ success: !err, event: event});
        })
    })
    .delete(function (req, res) {
        Event.findByIdAndRemove(req.params.event_id, function (err, event) {
            if (err)
                res.json({ success: false, message: err.message});

            res.json({ success: !err });
        });
    });

// route everything through `/api` 'cause I'm cool
app.use('/api', router);

// listen on 8080
app.listen(port);