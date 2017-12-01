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
        if (!s3) return res.send([]);
        
        db('images').select('*').then((value) => {
            if (value.length > 0) {
                return res.json(value);
            } else {
                return res.send('No images found.');
            }
        });
    },
    addImage: (req, res) => {
        if (req.files) {
           var uid = uuid() + ".jpg";
    
           s3.createObject({ body: req.files.file, key: uid }, (response) => {
               res.send(response);
           });
        }
    },
    deleteImages: (req, res) => {
        if (!s3) return res.send(false);
    
        if (req.body.keys && req.body.keys.length > 1) {
            s3.deleteObjects(req.body.keys, (success) => {
                return res.send(success);
            });
        } else {
            s3.deleteObject(req.body.keys[0], (success) => {
                return res.send(success);
            });
        }
    }
}
