const btoa = require('btoa');
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
            s3.getObjects(function (err, data) {
                if (err) return res.send(err);
        
                var arr = [];
        
                if (data.length > 0) {
                    data.forEach(function (element) {
                        arr.push(s3.s3Url + encodeURIComponent(element));
                    });
                }
        
                return res.json(arr);
            });
    },
    addImage: (req, res) => {
        console.log(req.files);
       if (req.files) {
           var uid = (btoa(moment.now().toString())).replace(/[^\w\s]/gi, '') + ".jpg";
    
           s3.createObject({ body: req.files.file, key: uid }, (response) => {
               res.send(response);
           });
       }
    },
    deleteImages: (req, res) => {
        if (!s3) return res.send(false);
    
        if (req.body.keys && req.body.keys.length > 1) {
            s3.deleteObjects(req.body.keys, (success) => {
                res.send(success);
            });
        } else {
            s3.deleteObject(req.body.keys[0], (success) => {
                res.send(success);
            });
        }
    }
}
