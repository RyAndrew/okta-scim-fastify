import fastify from 'fastify';
import store from './store.js';
import adapterFactory from './adapter.js';
import scimPlugin from './fastify-scim.js';
import { authMiddleware } from './auth-middleware.js';

const app = fastify({ logger: true });
const adapter = adapterFactory(store);

// Apply auth to all SCIM routes
app.addHook('preHandler', authMiddleware);

app.register(scimPlugin, { adapter, basePath: '/scim/v2' });

app.listen({ port: 8011, host: '0.0.0.0' })
  .then(() => app.log.info('SCIM server running at http://localhost:8011/scim/v2'))
  .catch(err => {
    app.log.error(err);
    process.exit(1);
  });
