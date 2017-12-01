// read .env variables for dev
require('dotenv').config();

// external libraries
const express = require('express');
const bodyParser = require('body-parser');
const formData = require('express-form-data');

// app setup
const app = express();

// prevent the bad men from being bad
app.disable('x-powered-by');

// DB setup
const db = require('knex')({
    client: 'pg',
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        port: process.env.DB_PORT,
        charset: 'utf8'
    }
});

const S3Utilities = require('./app/helpers/s3-utilities');
const s3 = new S3Utilities({
    bucketName: process.env.AWS_BUCKET_NAME,
    key: process.env.AWS_KEY,
    secretKey: process.env.AWS_SECRET_KEY,
    s3Url: process.env.AWS_S3_URL
});

// controllers
const eventController = require('./app/controllers/events-controller');
const imagesController = require('./app/controllers/images-controller');
const authController = require('./app/controllers/auth-controller');

// we need to pass AWS stuff into the images controller
imagesController.init(s3, db);
eventController.init(s3, db);
authController.init(process.env.SECRET_KEY, db);

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

// routing middleware
router.use((req, res, next) => {
    if (!req.header('x-jwt-token')) {
        if (req.path !== '/authenticate') {
            res.status(403);
            return res.send('Invalid Request: Missing auth token.');
        } else {
            next();
        }
    } else {
        authController.authenticateToken(req.header('x-jwt-token'), (verified) => {
            if (verified) {
                next();
            } else {
                res.status(403);
                return res.send('Invalid Request: Invalid auth token');
            }
        });
    }  
});

router.route('/authenticate')
    .post(authController.authenticateUser);

// the routing begins
// event stuff
router.route('/events')
    .get(eventController.findAllEvents);

router.route('/events/add')
    .post(eventController.addEvent);

router.route('/events/:event_id')
    .get(eventController.findEventById)
    .delete(eventController.deleteEvent);

router.route('/events/:event_id/edit')
    .put(eventController.editEvent);

// image stuff
router.route('/images')
    .get(imagesController.getImages)
    .delete(imagesController.deleteImages)
    .post(imagesController.addImage);

// route everything through `/api` 'cause I'm cool
app.use('/api', router);

// listen on 8080
app.listen(port);