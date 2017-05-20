// read .env variables for dev
require('dotenv').config();

// external libraries
const express = require('express');
var app = express();
const bodyParser = require('body-parser');

// db connections and stuff
const connectionString = process.env.MONGODB_URI;
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect(connectionString);

// data models
var Event = require('./app/models/event');

// s3 shit
const bucketName = process.env.AWS_BUCKET_NAME;
const awsKey = process.env.AWS_KEY;
const awsSecretKey = process.env.AWS_SECRET_KEY;
const awsS3Url = process.env.AWS_S3_URL;
var S3Utilities = require('./app/helpers/s3-utilities');
var s3 = new S3Utilities(bucketName, awsKey, awsSecretKey);

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
        console.log(req.body);

        var event = new Event({
            name: req.body.name,
            location: req.body.location,
            date: {
                startDate: req.body.date.startDate,
                endDate: req.body.date.endDate
            },
            url: req.body.url,
            type: req.body.type
        });

        event.save(function (err) {
            if (err)
                return res.json({ success: false, message: err.message});

            res.json({ success: !err, event: event });
        });
    });

router.route('/events/:event_id')
    .get(function (req, res) {
        Event.findById(req.params.event_id, function (err, event) {
            if (err)
                return res.json({ 'success': false, 'message': err.message});

            res.json({ success: !err, event: event});
        })
    })
    .delete(function (req, res) {
        Event.findByIdAndRemove(req.params.event_id, function (err, event) {
            if (err)
                return res.json({ success: false, message: err.message});

            res.json({ success: !err });
        });
    });

router.route('/images')
    .get(function (req, res) {
        s3.getObjects(function (err, data) {
            if (err) res.send(err);

            var arr = [];

            if (data.length > 0) {
                data.forEach(function (element) {
                    arr.push(awsS3Url + encodeURIComponent(element));
                });
            }

            res.json(arr);
        });
    })
    .delete(function (req, res) {

    })
    .post(function (req, res) {

    });

// route everything through `/api` 'cause I'm cool
app.use('/api', router);

// listen on 8080
app.listen(port);