"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _users = _interopRequireDefault(require("./users"));

var _bingos = _interopRequireDefault(require("./bingos"));

var _punters = _interopRequireDefault(require("./punters"));

var _quinary = _interopRequireDefault(require("./quinary"));

var _bettings = _interopRequireDefault(require("./bettings"));

var _reports = _interopRequireDefault(require("./reports"));

var _HomeController = _interopRequireDefault(require("../app/controllers/HomeController"));

var _session = _interopRequireDefault(require("../app/middlewares/session"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const routes = (0, _express.Router)(); // Home

routes.get('/', _session.default.onlyUsers, _HomeController.default.index); // Users

routes.use('/users', _users.default); // Bingo

routes.use('/bingos', _bingos.default); // Punter

routes.use('/punters', _punters.default); // Quinary

routes.use('/quinarys', _quinary.default); // Bets

routes.use('/bettings', _bettings.default); // Reports

routes.use('/reports', _reports.default);
var _default = routes;
exports.default = _default;