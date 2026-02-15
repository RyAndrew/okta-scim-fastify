import fp from 'fastify-plugin';
import { serviceProviderConfig, resourceTypes, schemas } from './scim-config.js';

const scimError = (status, detail) => ({
  schemas: ['urn:ietf:params:scim:api:messages:2.0:Error'],
  status: String(status),
  detail
});

export default fp((f, { basePath = '/scim/v2', adapter }, done) => {
  const U = `${basePath}/Users`;
  const G = `${basePath}/Groups`;

  const wrapList = ({ resources, totalResults, startIndex, itemsPerPage }) => ({
    schemas: ['urn:ietf:params:scim:api:messages:2.0:ListResponse'],
    Resources: resources,
    totalResults,
    startIndex,
    itemsPerPage
  });

  // ServiceProviderConfig
  f.get(`${basePath}/ServiceProviderConfig`, (_, r) => r.send(serviceProviderConfig));

  // ResourceTypes
  f.get(`${basePath}/ResourceTypes`, (_, r) =>
    r.send(wrapList({
      resources: resourceTypes,
      totalResults: resourceTypes.length,
      startIndex: 1,
      itemsPerPage: resourceTypes.length
    }))
  );

  // Schemas
  f.get(`${basePath}/Schemas`, (_, r) =>
    r.send(wrapList({
      resources: schemas,
      totalResults: schemas.length,
      startIndex: 1,
      itemsPerPage: schemas.length
    }))
  );

  f.get(`${basePath}/Schemas/:id`, (req, r) => {
    const s = schemas.find(x => x.id === req.params.id);
    if (!s) return r.code(404).send(scimError(404, 'Schema not found'));
    r.send(s);
  });

  // Users
  f.get(U, async (req, r) => r.send(wrapList(await adapter.listUsers(req))));
  f.post(U, async (req, r) => r.code(201).send(await adapter.createUser(req.body)));
  f.get(`${U}/:id`, async (req, r) => {
    const u = await adapter.getUser(req.params.id);
    if (!u) return r.code(404).send(scimError(404, 'User not found'));
    r.send(u);
  });
  f.put(`${U}/:id`, async (req, r) => r.send(await adapter.updateUser(req.params.id, req.body)));
  f.patch(`${U}/:id`, async (req, r) => {
    const u = await adapter.patchUser(req.params.id, req.body);
    if (!u) return r.code(404).send(scimError(404, 'User not found'));
    r.send(u);
  });
  f.delete(`${U}/:id`, async (req, r) => {
    await adapter.deleteUser(req.params.id);
    r.code(204).send();
  });

  // Groups
  f.get(G, async (req, r) => r.send(wrapList(await adapter.listGroups(req))));
  f.post(G, async (req, r) => r.code(201).send(await adapter.createGroup(req.body)));
  f.get(`${G}/:id`, async (req, r) => {
    const g = await adapter.getGroup(req.params.id);
    if (!g) return r.code(404).send(scimError(404, 'Group not found'));
    r.send(g);
  });
  f.put(`${G}/:id`, async (req, r) => r.send(await adapter.updateGroup(req.params.id, req.body)));
  f.patch(`${G}/:id`, async (req, r) => {
    const g = await adapter.patchGroup(req.params.id, req.body);
    if (!g) return r.code(404).send(scimError(404, 'Group not found'));
    r.send(g);
  });
  f.delete(`${G}/:id`, async (req, r) => {
    await adapter.deleteGroup(req.params.id);
    r.code(204).send();
  });

  done();
});
