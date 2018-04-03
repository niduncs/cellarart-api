require('dotenv').config({path: __dirname + '/../.env.test'});

beforeAll((done) => {
  global.knex = require('knex')({
    client: 'pg',
    connection: process.env.DATABASE_URL,
  });
  done();
  //global.knex.migrate.latest().then((value) => done()).catch((error) => console.error(error));
});

afterAll(() => {
  //global.knex.migrate.rollback().then((value) => console.log(value)).catch((error) => console.error(error));
})