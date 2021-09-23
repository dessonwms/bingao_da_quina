"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _db = _interopRequireDefault(require("./db"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const session = require('express-session');

const PgSession = require('connect-pg-simple')(session);

var _default = session({
  store: new PgSession({
    pool: _db.default,
    // Connection pool
    tableName: 'session'
  }),
  secret: 'parangaricutirimirruaro',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000
  } // 30 days

});

exports.default = _default;