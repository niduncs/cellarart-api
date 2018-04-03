const uuid = require('uuid/v4');
const moment = require('moment');

function ImagesController(s3, db) {
  this.s3 = s3;
  this.db = db;
}

ImagesController.prototype.getImages = function(req, res) {
  this.db('images')
    .select()
    .then(value => {
      if (value.length > 0) {
        res.status(200);
        return res.json(value);
      } else {
        res.status(400);
        return res.send('No images found.');
      }
    })
    .catch(error => {
      console.error(error);
      res.status(500);
      return res.send(error);
    });
};

ImagesController.prototype.deleteImages = function(req, res) {
  if (!this.s3) {
    res.status(500);
    return res.send('Unable to find S3Utilities');
  }

  if (req.body.keys && req.body.keys.length > 1) {
    this.s3
      .deleteObjects(req.body.keys)
      .then(() => {
        res.status(200);
        return res.send(true);
      })
      .catch(error => {
        console.log(error);
        res.status(500);
        return res.send(error);
      });
  } else {
    this.s3
      .deleteObject(req.body.keys[0])
      .then(() => {
        res.status(200);
        return res.send(true);
      })
      .catch(error => {
        console.error(error);
        res.status(500);
        return res.send(error);
      });
  }
};

ImagesController.prototype.addImage = function(req, res) {
  if (req.files && this.s3) {
    const uid = uuid() + '.jpg';

    this.s3
      .createObject({ body: req.files.file, key: uid })
      .then(response => {
        res.status(200);
        return res.send(response);
      })
      .catch(error => {
        res.status(500);
        return res.send(error);
      });
  } else {
    res.status(500);
    return res.send(
      'Missing an image or S3Utilities not configured correctly.'
    );
  }
};

module.exports = ImagesController;
