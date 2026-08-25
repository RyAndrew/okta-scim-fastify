export default {
  client: 'sqlite3',
  connection: { filename: process.env.DB_FILENAME || './data/scim.db' },
  useNullAsDefault: true,
  migrations: { directory: './migrations' }
};
