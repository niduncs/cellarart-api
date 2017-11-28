const AWS = require('aws-sdk');

function S3Utilities(params) {
    this.s3 = new AWS.S3({
        accessKeyId: params.key,
        secretAccessKey: params.secretKey,
        signatureVersion: 'v4'
    });
    this.bucketName = params.bucketName;
    this.s3Url = params.s3Url;
}

S3Utilities.prototype.getObjects = function(callback) {
    var images = [];
    var params = {
        Bucket: this.bucketName
    };

    this.s3.listObjects(params, function (err, data) {
        if (err) callback(err, []);

        if (data && data.Contents.length > 0) {
            data.Contents.forEach(function (element) {
                images.push(element.Key);
            });
        }

        callback(null, images);
    });
};

S3Utilities.prototype.createObject = function (data, callback) {
    var params = {
        Bucket: this.bucketName,
        Key: data.key,
        ACL: "public-read",
        Body: data.body
    };

    this.s3.upload(params, function (err, data) {
        callback(!err);
    })
};

S3Utilities.prototype.deleteObject = function (key, callback) {
    var params = {
        Bucket: this.bucketName,
        Key: key
    };

    this.s3.deleteObject(params, function (err) {
        callback(!err);
    });
};

S3Utilities.prototype.deleteObjects = function (keys, callback) {
    var objects = [];

    keys.forEach(function (key, i) {
        objects[i] = { Key: key };
    });

    var params = {
        Bucket: this.bucketName,
        Delete: {
            Objects: deleteMe
        }
    };

    this.s3.deleteObjects(params, function (err) {
        if (err) console.log(err);
        callback(!err);
    });
};

module.exports = S3Utilities;