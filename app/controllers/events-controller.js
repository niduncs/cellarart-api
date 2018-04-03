function EventsController(db) {
  this.db = db;
}

EventsController.prototype.findEventById = function(req, res) {
  this.db('events')
    .where({ id: req.params.event_id })
    .select()
    .then(value => {
      if (value[0]) {
        res.status(200);
        return res.json(value[0]);
      } else {
        res.status(404);
        return res.send('No event found for ID: ' + req.params.event_id);
      }
    })
    .catch(e => {
      console.error(e);
      res.status(500);
      return res.send(e);
    });
};

EventsController.prototype.findAllEvents = function(req, res) {
  this.db('events')
    .select()
    .then(value => {
      if (value.length > 0) {
        res.status(200);
        return res.json(value);
      } else {
        res.status(404);
        return res.send('No events found.');
      }
    })
    .catch(e => {
      console.error(e);
      res.status(500);
      return res.send(e);
    });
};

EventsController.prototype.addEvent = function(req, res) {
  this.db('events')
    .insert(req.body)
    .returning('*')
    .then(value => {
      if (value[0]) {
        res.status(200);
        return res.json(value[0]);
      } else {
        res.status(500);
        return res.send('Something went wrong, please try again');
      }
    })
    .catch(e => {
      console.error(e);
      res.status(500);
      return res.send(e);
    });
};

EventsController.prototype.editEvent = function(req, res) {
  this.db('events')
    .where({ id: req.params.event_id })
    .update(req.body)
    .returning('*')
    .then(value => {
      if (value[0]) {
        res.status(200);
        return res.json(value[0]);
      } else {
        res.status(500);
        return res.send('Something went wrong, please try again');
      }
    })
    .catch(e => {
      console.error(e);
      res.status(500);
      return res.send(e);
    });
};

EventsController.prototype.deleteEvent = function(req, res) {
  this.db('events')
    .where({ id: req.params.event_id })
    .del()
    .then(v => {
      res.status(200);
      return res.send(v);
    })
    .catch(e => {
      console.error(e);
      res.status(500);
      return res.send(e);
    });
};

module.exports = EventsController;
