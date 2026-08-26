export const scimError = (status, detail) => ({
  schemas: ['urn:ietf:params:scim:api:messages:2.0:Error'],
  status: String(status),
  detail
});
