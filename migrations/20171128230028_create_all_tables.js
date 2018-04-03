exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('users', function(table) {
      table.increments().primary();
      table.string('name');
      table.string('password');
      table.timestamps();
    }),

    knex.schema.createTable('events', function(table) {
      table.increments().primary();
      table.string('name');
      table.string('link_url');
      table.string('link_text');
      table.timestamp('starting_at');
      table.timestamp('ending_at');
      table.timestamps();
    }),

    knex.schema.createTable('images', function(table) {
      table.increments().primary();
      table.string('title');
      table.string('description');
      table.string('s3_location');
      table.string('s3_key');
      table.timestamps();
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTableIfExists('users'),
    knex.schema.dropTableIfExists('events'),
    knex.schema.dropTableIfExists('images')
  ]);
};
