
const eventsLocation = 'https://s3.ca-central-1.amazonaws.com/cellarart/events.json';
const axios = require('axios');
const uuid = require('uuid/v4');
const s3utils = require('../helpers/s3-utilities');
let s3 = null;
let dbConnection = null;

const controller = {
    init: function(config, db) {
        s3 = new s3utils(config);
        dbConnection = db;
    },
    findEventById: function (req, res) {
        axios.get(eventsLocation)
            .then((response) => {                
                return res.json(response.data.find(x => x.id === req.params.event_id));
            })
            .catch((errors) => { 
                console.log(errors) 
            });
    },
    findAllEvents: function (req, res) {
        axios.get(eventsLocation)
            .then((response) => { 
                return res.json(response.data) 
            })
            .catch((errors) => { 
                console.log(errors)
            });
    },
    addEvent: function (req, res) {
        axios.get(eventsLocation)
            .then((response) => {
                if (response.data) {
                    req.body.id = uuid();
                    response.data.push(req.body);
                    s3.createObject({ key: 'events.json', body: JSON.stringify(response.data) }, function(isCreated) {
                        return res.send(isCreated);
                    });
                } else {
                    res.send('No events :(');
                }
            })
            .catch((errors) => { 
                console.log(errors);
            });
    },
    editEvent: function (req, res) {
        axios.get(eventsLocation)
            .then((response) => {
                if (response.data) {
                    events = response.data.filter((v) => v.id !== req.params.event_id);
                    events.push(req.body);
                    s3.createObject({ key: 'events.json', body: JSON.stringify(events) }, function(isCreated) {
                        return res.send(isCreated);
                    });
                } else {
                    res.send('No events :(');
                }
            })
            .catch((errors) => {
                console.log(errors);
            });
    }
};

module.exports = controller;
