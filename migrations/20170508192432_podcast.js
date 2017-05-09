
exports.up = function(knex, Promise) {
  return Promise.all([

      knex.schema.createTable('users', (table) => {
      table.increments('uid').primary();
      table.string('username');
      table.string('password');
      table.timestamps();
    }),

    knex.schema.createTable('podcasts', (table) => {
      table.increments('collectionId').primary().unique();
      table.string('collectionName');
      table.string('feedUrl');
      table.string('artistName');
    }),

    knex.schema.createTable('episodes', (table) => {
      table.increments('id').primary();
      table.string('title');
      table.string('url');
      table.string('duration');
      table.string('pubDate');
      table.integer('collectionId');
    }),

    knex.schema.createTable('user_episodes', (table) => {
      table.increments('id').primary();
      table.integer('user_id');
      table.integer('podcast_id');
    })
  ])
};

exports.down = function(knex, Promise) {
   return Promise.all([
        knex.schema.dropTable('users'),
        knex.schema.dropTable('podcasts'),
        knex.schema.dropTable('episodes'),
        knex.schema.dropTable('user_episodes'),
    ])
};
