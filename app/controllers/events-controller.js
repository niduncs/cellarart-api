const uuid = require('uuid/v4');
const s3utils = require('../helpers/s3-utilities');
let s3 = null;
let dbConnection = null;

module.exports = {
    init: (config, db) => {
        s3 = new s3utils(config);
        dbConnection = db;
    },
    findEventById: (req, res) => {
        dbConnection('events').where({ id: req.params.event_id }).select('*').then((value) => { 
            if (value[0]) {
                return res.json(value[0]);
            } else {
                return res.send('No event found for ID: ' + req.params.event_id);
            }
        });
    },
    findAllEvents: (req, res) => {
        dbConnection('events').select('*').then((value) => {
            if (value.length > 0) {
                return res.json(value);
            } else {
                return res.send('No events found.');
            }
        });
    },
    addEvent: (req, res) => {
        dbConnection('events').insert(req.body).returning('*').then((value) => {
            if (value[0]) {
                return res.json(value[0]);
            } else {
                return res.send('Something went wrong, please try again');
            }
        });
    },
    editEvent: (req, res) => {
        dbConnection('events').where({ id: req.params.event_id }).update(req.body).returning('*').then((value) => {
            if (value[0]) {
                return res.json(value[0]);
            } else {
                return res.send('Something went wrong, please try again')
            }
        });
    }
};
