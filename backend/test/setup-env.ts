process.env.NODE_ENV = 'test';
process.env.DB_SYNCHRONIZE = 'true';
process.env.DB_DROP_SCHEMA = 'true';
process.env.AUTH_USER = 'e2e-admin';
process.env.AUTH_PASS = 'e2e-password';
process.env.JWT_ACCESS_SECRET = 'e2e-access-secret-with-at-least-32-characters';
process.env.JWT_REFRESH_SECRET =
  'e2e-refresh-secret-with-at-least-32-characters';
