const AWS = require('aws-sdk');

function S3Utilities(bucketName, awsKey, awsSecretKey) {
    this.s3 = new AWS.S3({
        accessKeyId: awsKey,
        secretAccessKey: awsSecretKey,
        signatureVersion: 'v4'
    });
    this.bucketName = bucketName;
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

};

S3Utilities.prototype.deleteObject = function (key, callback) {

};

module.exports = S3Utilities;