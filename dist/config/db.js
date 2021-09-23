"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _pg = require("pg");

var _default = new _pg.Pool({
  user: 'postgres',
  password: 'docker',
  host: 'localhost',
  port: 5432,
  database: 'betting_system'
});

exports.default = _default;