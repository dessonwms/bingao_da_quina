"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _session = _interopRequireDefault(require("../app/middlewares/session"));

var _ReportController = _interopRequireDefault(require("../app/controllers/ReportController"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import BingoValidator from '../app/validators/BingoValidator';
const routes = (0, _express.Router)(); // Formulário de update

routes.get('/haswinner', _session.default.onlyUsers, _ReportController.default.hasWinner);
var _default = routes;
exports.default = _default;