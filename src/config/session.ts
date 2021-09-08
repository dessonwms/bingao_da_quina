import db from './db';

const session = require('express-session');
const PgSession = require('connect-pg-simple')(session);

export default session({
  store: new PgSession({
    pool: db, // Connection pool
    tableName: 'session',
  }),
  secret: 'parangaricutirimirruaro',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }, // 30 days
});
