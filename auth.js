import dotenv from 'dotenv';
dotenv.config()

import { createRemoteJWKSet, jwtVerify } from 'jose';

const ISSUER = process.env.OAUTH_ISSUER;
const AUDIENCE = process.env.OAUTH_AUDIENCE;

const JWKS = createRemoteJWKSet(new URL(`${ISSUER}/v1/keys`));

export async function validateAccessToken(token) {
  try {
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: ISSUER,
      audience: AUDIENCE
    });

    return payload;
  } catch (err) {
    throw new Error('invalid_token');
  }
}
