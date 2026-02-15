export const USER_SCHEMA = 'urn:ietf:params:scim:schemas:core:2.0:User';
export const GROUP_SCHEMA = 'urn:ietf:params:scim:schemas:core:2.0:Group';

export const serviceProviderConfig = {
  schemas: ['urn:ietf:params:scim:schemas:core:2.0:ServiceProviderConfig'],
  patch: { supported: true },
  filter: { supported: true, maxResults: 200 },
  bulk: { supported: false },
  changePassword: { supported: false },
  sort: { supported: false },
  etag: { supported: false },
  authenticationSchemes: []
};

export const resourceTypes = [
  {
    id: 'User',
    name: 'User',
    endpoint: '/Users',
    schema: USER_SCHEMA,
    schemas: ['urn:ietf:params:scim:schemas:core:2.0:ResourceType']
  },
  {
    id: 'Group',
    name: 'Group',
    endpoint: '/Groups',
    schema: GROUP_SCHEMA,
    schemas: ['urn:ietf:params:scim:schemas:core:2.0:ResourceType']
  }
];

export const schemas = [
  {
    id: USER_SCHEMA,
    name: 'User',
    schemas: ['urn:ietf:params:scim:schemas:core:2.0:Schema']
  },
  {
    id: GROUP_SCHEMA,
    name: 'Group',
    schemas: ['urn:ietf:params:scim:schemas:core:2.0:Schema']
  }
];
