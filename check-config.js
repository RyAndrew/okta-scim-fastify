const REQUIRED_ENV_VARS = ['OAUTH_ISSUER', 'OAUTH_AUDIENCE'];

const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);

if (missing.length) {
  console.error(`Missing required environment variable(s): ${missing.join(', ')}`);
  process.exit(1);
}
