# Okta Compatible SCIM Server
* Node.js - Fastify + Knex + Jose
* Imports Users into Okta
* Provision users from Okta
* Sqlite for data storage

## Config
create a .env file or edit docker compose
### Required
```
OAUTH_ISSUER=https://your-okta-domain/oauth2/default
OAUTH_AUDIENCE=api://scim-server
```
### Optional (defaults shown)
```
DB_FILENAME=./data/scim.db
PORT=8011
```