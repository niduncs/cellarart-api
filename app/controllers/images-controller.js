const uuid = require('uuid/v4');
const moment = require('moment');
const S3Utilities = require('../helpers/s3-utilities');
let s3 = null;
let dbConnection = null;

module.exports = {
    init: (config, db) => {
        s3 = new S3Utilities(config);
        dbConnection = db;
    },
    getImages: (req, res) => {
        db('images').select('*').then((value) => {
            if (value.length > 0) {
                res.status(200);
                return res.json(value);
            } else {
                res.status(500);
                return res.send('No images found.');
            }
        });
    },
    addImage: (req, res) => {
        if (req.files && s3) {
           var uid = uuid() + ".jpg";
    
           s3.createObject({ body: req.files.file, key: uid }, (response) => {
               res.status(200);
               return res.send(response);
           });
        } else {
            res.status(500);
            return res.send('Missing an image or S3Utilities not configured correctly.');
        }
    },
    deleteImages: (req, res) => {
        if (!s3) {
            res.status(500);
            return res.send('Unable to find S3Utilities');
        }
    
        if (req.body.keys && req.body.keys.length > 1) {
            s3.deleteObjects(req.body.keys, (success) => {
                res.status(success ? 200 : 500);
                return res.send(success);
            });
        } else {
            s3.deleteObject(req.body.keys[0], (success) => {
                res.status(success ? 200 : 500);
                return res.send(success);
            });
        }
    }
}
