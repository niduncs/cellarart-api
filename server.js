// read .env variables for dev
require('dotenv').config();

// external libraries
const express = require('express');
const bodyParser = require('body-parser');
const formData = require('express-form-data');

// app setup
const app = express();

// DB setup
var db = require('./app/db');
db.connect(process.env.MONGODB_URI);

const awsConfig = {
    bucketName: process.env.AWS_BUCKET_NAME,
    key: process.env.AWS_KEY,
    secretKey: process.env.AWS_SECRET_KEY,
    s3Url: process.env.AWS_S3_URL
};

// controllers
const eventController = require('./app/controllers/events-controller');
const imagesController = require('./app/controllers/images-controller');
const authController = require('./app/controllers/auth-controller');

// we need to pass AWS stuff into the images controller
imagesController.init(awsConfig);
eventController.init(awsConfig);
authController.init(process.env.SECRET_KEY);

// router setup
const port = process.env.PORT || 8080;
var router = express.Router();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// parsing data with connect-multiparty.
app.use(formData.parse());
// clear all empty files (size == 0)
app.use(formData.format());
// change file objects to node stream.Readable
app.use(formData.stream());
// union body and files
app.use(formData.union());

// prevent the bad men from being bad
app.disable('x-powered-by');

// routing middleware
router.use(function (req, res, next) {
    if (!req.header('x-jwt-token')) {
        if (req.path !== '/authenticate') {
            res.status(403);
            return res.send('Invalid Request: Missing auth token.');
        } else {
            next();
        }
    } 

    authController.authenticateToken(req.header('x-jwt-token'), (verified) => {
        if (verified) {
            next();
        } else {
            res.status(403);
            return res.send('Invalid Request: Invalid auth token');
        }
    });
});

router.route('/authenticate')
    .post(authController.authenticateUser);

// the routing begins
// event stuff
router.route('/events')
    .get(eventController.findAllEvents)
    .post(eventController.addEvent);

router.route('/events/:event_id')
    .get(eventController.findEventById);
    //.delete(eventController.deleteEvent);

router.route('/events/add')
    .post(eventController.addEvent);

router.route('/events/:event_id/edit')
    .put();

// image stuff
router.route('/images')
    .get(imagesController.getImages)
    .delete(imagesController.deleteImages)
    .post(imagesController.addImage);

// route everything through `/api` 'cause I'm cool
app.use('/api', router);

// listen on 8080
app.listen(port);