const S3Utilities = require('../helpers/s3-utilities');
var module = module.exports = {};
var s3 = null;

module.constructor = function (awsParams) {
    s3 = new S3Utilities(awsParams);
};

module.getImages = function (req, res) {
    if (!s3) return res.send([]);

    s3.getObjects(function (err, data) {
        if (err) res.send(err);

        var arr = [];

        if (data.length > 0) {
            data.forEach(function (element) {
                arr.push(s3.s3Url + encodeURIComponent(element));
            });
        }

        res.json(arr);
    });
};

module.addImage = function (res, req, next) {

};

module.deleteImages = function (req, res) {
    if (!s3) return res.send(false);

    if (req.body.keys && req.body.keys.length > 1) {
        s3.deleteObjects(req.body.keys, function (success) {
            res.send(success);
        });
    } else {
        s3.deleteObject(req.body.keys[0], function (success) {
            res.send(success);
        });
    }
};


