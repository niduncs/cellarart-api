require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const formData = require('express-form-data');

const app = express();
app.disable('x-powered-by');

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

const EventsController = require('./app/controllers/events-controller');
const ImagesController = require('./app/controllers/images-controller');
const AuthController = require('./app/controllers/auth-controller');
const imagesController = new ImagesController(s3, db);
const eventsContoller = new EventsController(db);
const authController = new AuthController(process.env.SECRET_KEY, db);

var router = express.Router();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// file manipulation
app.use(formData.parse());
app.use(formData.format());
app.use(formData.stream());
app.use(formData.union());

// authentication "middleware"
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

router.route('/events')
    .get(eventController.findAllEvents);

router.route('/events/add')
    .post(eventController.addEvent);

router.route('/events/:event_id')
    .get(eventController.findEventById)
    .delete(eventController.deleteEvent);

router.route('/events/:event_id/edit')
    .put(eventController.editEvent);

router.route('/images')
    .get(imagesController.getImages)
    .delete(imagesController.deleteImages)
    .post(imagesController.addImage);

app.use('/api', router);
app.listen(process.env.PORT || 8080);