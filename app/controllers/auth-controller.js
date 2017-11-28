const btoa = require('btoa');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
let secretKey = null;

const controller = {
    init: function(secret) {
        secretKey = secret;
    },
    authenticateUser: function(req, res) {
        if (!req.body.name || !req.body.password) {
            return res.send('Name or password missing');
        }
    
        User.findOne({ username: req.body.name, password: req.body.password }, '', function (err, user) {
            if (user) {
                jwt.sign(user._id, secretKey, { expiresIn: '10d' }, function(err, token) {
                    if (!err) {
                        return res.json({ token: token });
                    }
    
                    return res.send('Error signing token.');
                });
            }
    
            return err ? res.send(err) : res.send('Invalid user.');
        });
    },
    authenticateToken: function(token, callback) {
        jwt.verify(token, secretKey, function(err, decoded) {
            callback(!err);
        });
    }
}

module.exports = controller;