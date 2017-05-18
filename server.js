// external libraries
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

// db connections and stuff
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://127.0.0.1:27017/niall');

// internal helper classes
var dateHelpers = require('./app/helpers/date-helpers');

// data models
var Event = require('./app/models/event');
var SiteContent = require('./app/models/sitecontent');

// little bit of setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;
var router = express.Router();


// routing middleware
router.use(function (req, res, next) {
    next();
});

// the routing begins
// event stuff
router.route('/event')
    .get(function (req, res) {
        Event.find(function (err, events) {
            if (err)
                res.send(err);

            res.json(events);
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
                res.send(err);

            res.json({ success: !err });
        });
    });

router.route('/events/:event_id')
    .delete(function (req, res) {
        Event.findById(req.params.event_id, function (err) {
            if (err)
                res.send(err);

            res.json({ success: !err });
        });
    });

// site content stuff
router.route('/site-content')
    .get(function (req, res) {
        SiteContent.find(function (err, siteContent) {
           if (err)
               res.send(err);

           res.json(siteContent);
        });
    })
    .put(function (req, res) {
        SiteContent.find(function (err, siteContent) {
            if (err)
                res.send(err);

            if (siteContent) {
                siteContent.aboutMe = req.params.aboutMe;
                siteContent.artistStatement = req.params.artistStatement;

                siteContent.save(function (err) {
                    if (err) res.send(err);

                    res.json({ success: !err })
                })
            }
        })
    });

// route everything through `/api` 'cause I'm cool
app.use('/api', router);

// listen on 8080
app.listen(port);