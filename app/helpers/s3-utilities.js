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

S3Utilities.prototype.getObjects = function() {
  return new Promise((resolve, reject) => {
    var images = [];
    var params = {
      Bucket: this.bucketName
    };

    this.s3.listObjects(params, function(err, data) {
      if (err) reject(err);

      if (data && data.Contents.length > 0) {
        data.Contents.forEach(function(element) {
          images.push(element.Key);
        });
      }

      resolve(images);
    });
  });
};

S3Utilities.prototype.createObject = function(data, callback) {
  return new Promise((resolve, reject) => {
    var params = {
      Bucket: this.bucketName,
      Key: data.key,
      ACL: 'public-read',
      Body: data.body
    };

    this.s3.upload(params, function(err, data) {
      if (err) reject(err);
      resolve(data);
    });
  });
};

S3Utilities.prototype.deleteObject = function(key, callback) {
  return new Promise((resolve, reject) => {
    var params = {
      Bucket: this.bucketName,
      Key: key
    };

    this.s3.deleteObject(params, function(err) {
      if (err) reject(err);
      resolve();
    });
  });
};

S3Utilities.prototype.deleteObjects = function(keys, callback) {
  return new Promise((resolve, reject) => {
    var objects = [];

    keys.forEach(function(key, i) {
      objects[i] = { Key: key };
    });

    var params = {
      Bucket: this.bucketName,
      Delete: {
        Objects: deleteMe
      }
    };

    this.s3.deleteObjects(params, function(err) {
      if (err) reject(err);
      resolve();
    });
  });
};

module.exports = S3Utilities;
