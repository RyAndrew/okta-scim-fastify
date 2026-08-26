import { validateAccessToken } from './auth.js';
import { scimError } from './scim-errors.js';

export async function authMiddleware(req, reply) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    reply.code(401).send(scimError(401, 'missing_token'));
    return;
  }

  const token = header.slice('Bearer '.length);

  try {
    req.user = await validateAccessToken(token);
  } catch {
    reply.code(401).send(scimError(401, 'invalid_token'));
  }
}
