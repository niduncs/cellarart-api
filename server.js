// read .env variables for dev
require('dotenv').config();

// external libraries
const express = require('express');
const bodyParser = require('body-parser');
var app = express();

var db = require('./app/db');
db.connect(process.env.MONGODB_URI);

// controllers
var eventController = require('./app/controllers/events-controller');
var imagesController = require('./app/controllers/images-controller');

// s3 shit
const awsParams = {
    bucketName: process.env.AWS_BUCKET_NAME,
    key: process.env.AWS_KEY,
    secretKey: process.env.AWS_SECRET_KEY,
    s3Url: process.env.AWS_S3_URL
};
// we need to pass AWS stuff into the images controller
imagesController.constructor(awsParams);

const S3Utilities = require('./app/helpers/s3-utilities');
const s3 = new S3Utilities(awsParams);

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
    .get(eventController.findEvents)
    .post(eventController.addEvent);

router.route('/events/:event_id')
    .get(eventController.findEventById)
    .delete(eventController.deleteEvent);

router.route('/images')
    .get(imagesController.getImages)
    .delete(imagesController.deleteImages)
    .post(imagesController.addImage);

// route everything through `/api` 'cause I'm cool
app.use('/api', router);

// listen on 8080
app.listen(port);