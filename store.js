import knexInit from 'knex';
import knexConfig from './knexfile.js';

const knex = knexInit(knexConfig);

const parseRaw = rows => rows.map(r => JSON.parse(r.raw));

const applyFilter = (qb, table, filter) => {
  if (!filter) return;
  const m = filter.match(/^\s*([\w.]+)\s+eq\s+"([^"]+)"\s*$/);
  if (!m) return;
  const [_, attr, value] = m;

  const map = {
    users: { userName: 'userName', id: 'id', externalId: 'externalId' },
    groups: { displayName: 'displayName', id: 'id' }
  };

  if (map[table][attr]) qb.where(map[table][attr], value);
};

const paginate = (qb, startIndex, count) => {
  const s = Math.max(parseInt(startIndex || '1', 10), 1);
  const c = Math.max(parseInt(count || '100', 10), 1);
  qb.limit(c).offset(s - 1);
  return { startIndex: s, itemsPerPage: c };
};

export default {
  users: {
    list: async ({ filter, startIndex, count }) => {
      const base = knex('users');
      applyFilter(base, 'users', filter);
      const total = (await base.clone().count({ c: '*' }).first()).c;
      const page = paginate(base, startIndex, count);
      const rows = await base.select('raw');
      return { resources: parseRaw(rows), totalResults: Number(total), ...page };
    },
    get: id => knex('users').where({ id }).first('raw'),
    create: u => knex('users').insert({
      id: u.id,
      userName: u.userName,
      externalId: u.externalId || null,
      raw: JSON.stringify(u)
    }),
    update: (id, u) => knex('users').where({ id }).update({
      userName: u.userName,
      externalId: u.externalId || null,
      raw: JSON.stringify(u)
    }),
    delete: id => knex('users').where({ id }).delete()
  },

  groups: {
    list: async ({ filter, startIndex, count }) => {
      const base = knex('groups');
      applyFilter(base, 'groups', filter);
      const total = (await base.clone().count({ c: '*' }).first()).c;
      const page = paginate(base, startIndex, count);
      const rows = await base.select('raw');
      return { resources: parseRaw(rows), totalResults: Number(total), ...page };
    },
    get: async id => {
      const g = await knex('groups').where({ id }).first('raw');
      if (!g) return null;
      const members = await knex('group_members').where({ groupId: id });
      const obj = JSON.parse(g.raw);
      obj.members = members.map(m => ({ value: m.userId, type: 'User' }));
      return obj;
    },
    create: async g => {
      await knex('groups').insert({
        id: g.id,
        displayName: g.displayName,
        raw: JSON.stringify(g)
      });
      if (g.members?.length) {
        await knex('group_members').insert(
          g.members.map(m => ({ groupId: g.id, userId: m.value }))
        );
      }
    },
    update: async (id, g) => {
      await knex('groups').where({ id }).update({
        displayName: g.displayName,
        raw: JSON.stringify(g)
      });
      await knex('group_members').where({ groupId: id }).delete();
      if (g.members?.length) {
        await knex('group_members').insert(
          g.members.map(m => ({ groupId: id, userId: m.value }))
        );
      }
    },
    delete: async id => {
      await knex('group_members').where({ groupId: id }).delete();
      await knex('groups').where({ id }).delete();
    }
  },

  requestLog: {
    create: entry => knex('request_log').insert(entry)
  }
};
