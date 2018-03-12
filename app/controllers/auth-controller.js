const btoa = require('btoa');
const jwt = require('jsonwebtoken');

function AuthController(secret, db) {
    this.secret = secret;
    this.db = db;
}

AuthController.prototype.authenticateUser = function(req, res) {
    if (!req.body.name || !req.body.password) {
        return res.send('Name or password missing');
    }

    let user = null;

    this.db('users')
        .where({
            name: req.body.name,
            password: req.body.password
        })
        .select('*')
        .then((value) => {
            if (value[0]) {
                jwt.sign(value[0], this.secret, { expiresIn: '10d' }, (err, token) => {
                    if (!err) {
                        return res.json({ token: token });
                    }
        
                    return res.send('Error signing token.');
                });
            } else {
                return res.send('Unable to find user.');
            }
        });
};

AuthController.prototype.authenticateToken = function (req, res) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, this.secret, (err, decoded) => {
            if(err) reject(err);
            resolve(decoded);
        });
    });
    
};


module.exports = AuthController;