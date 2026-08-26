export async function up(knex) {
  await knex.schema.createTable('request_log', t => {
    t.increments('id').primary();
    t.string('timestamp').notNullable();
    t.string('method').notNullable();
    t.string('path').notNullable();
    t.string('query');
    t.integer('statusCode');
    t.text('errorMessage');
    t.text('errorStack');
  });
}

export async function down(knex) {
  await knex.schema.dropTable('request_log');
}
