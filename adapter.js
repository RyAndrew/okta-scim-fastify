import generateId from './id.js';
import { USER_SCHEMA, GROUP_SCHEMA } from './scim-config.js';

const applyPatch = (resource, patch) => {
  if (!patch?.Operations) return resource;
  for (const op of patch.Operations) {
    const type = (op.op || '').toLowerCase();
    if (type === 'replace') {
      if (!op.path) Object.assign(resource, op.value);
      else resource[op.path] = op.value;
    }
  }
  return resource;
};

export default function adapter(store) {
  return {
    // Users
    listUsers: req => store.users.list(req.query || {}),
    getUser: async id => {
      const r = await store.users.get(id);
      return r ? JSON.parse(r.raw) : null;
    },
    createUser: async data => {
      const u = { id: generateId(), schemas: [USER_SCHEMA], ...data };
      await store.users.create(u);
      return u;
    },
    updateUser: async (id, data) => {
      const u = { id, schemas: [USER_SCHEMA], ...data };
      await store.users.update(id, u);
      return u;
    },
    patchUser: async (id, patch) => {
      const existing = await store.users.get(id);
      if (!existing) return null;
      const obj = JSON.parse(existing.raw);
      const patched = applyPatch(obj, patch);
      patched.schemas = [USER_SCHEMA];
      await store.users.update(id, patched);
      return patched;
    },
    deleteUser: id => store.users.delete(id),

    // Groups
    listGroups: req => store.groups.list(req.query || {}),
    getGroup: id => store.groups.get(id),
    createGroup: async data => {
      const g = { id: generateId(), schemas: [GROUP_SCHEMA], ...data };
      await store.groups.create(g);
      return g;
    },
    updateGroup: async (id, data) => {
      const g = { id, schemas: [GROUP_SCHEMA], ...data };
      await store.groups.update(id, g);
      return g;
    },
    patchGroup: async (id, patch) => {
      const existing = await store.groups.get(id);
      if (!existing) return null;
      const patched = applyPatch(existing, patch);
      patched.schemas = [GROUP_SCHEMA];
      await store.groups.update(id, patched);
      return patched;
    },
    deleteGroup: id => store.groups.delete(id)
  };
}
