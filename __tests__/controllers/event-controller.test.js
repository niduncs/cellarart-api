const EventsController = require('../../app/controllers/events-controller');
let eventsController = null

beforeAll(() => {
  eventsController = new EventsController(knex);
});

it('tests constructor', () => {
  expect(eventsController).toBeInstanceOf(EventsController);
  expect(eventsController.db).toBe(knex);
});

it('tests all methods exist', () => {
  expect(eventsController).toHaveProperty('findEventById');
  expect(eventsController).toHaveProperty('findAllEvents');
  expect(eventsController).toHaveProperty('addEvent');
  expect(eventsController).toHaveProperty('editEvent');
  expect(eventsController).toHaveProperty('deleteEvent');
});