const btoa = require('btoa');
const jwt = require('jsonwebtoken');
let secretKey = null;
let db = null;

module.exports = {
    init: (secret, dbConnection) => {
        secretKey = secret;
        db = dbConnection;
    },
    authenticateUser: (req, res) => {
        if (!req.body.name || !req.body.password) {
            return res.send('Name or password missing');
        }

        let user = null;
    
        db('users').where({
            name: req.body.name,
            password: req.body.password
        }).select('*').then((value) => {
            if (value[0]) {
                jwt.sign(value[0], secretKey, { expiresIn: '10d' }, (err, token) => {
                    if (!err) {
                        return res.json({ token: token });
                    }
                    console.log(err);
        
                    return res.send('Error signing token.');
                });
            } else {
                res.send('Unable to find user.');
            }
        });
    },
    authenticateToken: (token, callback) => {
        jwt.verify(token, secretKey, (err, decoded) => {
            callback(!err);
        });
    }
}
