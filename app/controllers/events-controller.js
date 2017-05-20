// data models
var Event = require('../models/event');
var exports = module.exports = {};

exports.findEvents = function (req, res) {
    Event.find(function (err, events) {
        if (err)
            return res.json({success: false, message: err.message});

        if (events.length > 0)
            return res.json(events);

        return res.json({success: true, message: 'No events to return!'});
    });
};

exports.findEventById = function (req, res) {
    Event.findById(req.params.event_id, function (err, event) {
        if (err)
            return res.json({ 'success': false, 'message': err.message});

        return res.json({ success: !err, event: event});
    });
};

exports.addEvent = function (req, res) {
    var event = new Event({
        name: req.body.name,
        location: req.body.location,
        date: {
            startDate: req.body.date.startDate,
            endDate: req.body.date.endDate
        },
        url: req.body.url,
        type: req.body.type
    });

    event.save(function (err) {
        if (err)
            return res.json({success: false, message: err.message});

        return res.json({success: !err, event: event});
    });
};

exports.deleteEvent = function (req, res) {
    Event.findByIdAndRemove(req.params.event_id, function (err, event) {
        if (err)
            return res.json({ success: false, message: err.message});

        return res.json({ success: !err });
    });
};
