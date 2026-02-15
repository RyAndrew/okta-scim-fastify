export async function up(knex) {
  await knex.schema.createTable('users', t => {
    t.string('id').primary();
    t.string('userName').unique();
    t.string('externalId');
    t.json('raw');
  });

  await knex.schema.createTable('groups', t => {
    t.string('id').primary();
    t.string('displayName');
    t.json('raw');
  });

  await knex.schema.createTable('group_members', t => {
    t.string('groupId');
    t.string('userId');
    t.primary(['groupId', 'userId']);
  });
}

export async function down(knex) {
  await knex.schema.dropTable('group_members');
  await knex.schema.dropTable('groups');
  await knex.schema.dropTable('users');
}
