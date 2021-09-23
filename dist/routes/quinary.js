"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _QuinaryController = _interopRequireDefault(require("../app/controllers/QuinaryController"));

var _session = _interopRequireDefault(require("../app/middlewares/session"));

var _QuinaryValidator = _interopRequireDefault(require("../app/validators/QuinaryValidator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const routes = (0, _express.Router)(); // Formulário de cadastro de Sorteio da Quina

routes.get('/register', _session.default.onlyUsers, _QuinaryValidator.default.registrationBlocked, _QuinaryController.default.registerForm); // Salva o Sorteio da Quina no Banco

routes.post('/register', _session.default.onlyUsers, _QuinaryValidator.default.registrationBlocked, _QuinaryController.default.post); // Formulário de Edição de Sorteio da Quina

routes.get('/:id/edit', _session.default.onlyUsers, _QuinaryValidator.default.registrationBlocked, _QuinaryController.default.edit); // Atualiza o Sorteio da Quina no banco

routes.put('/', _session.default.onlyUsers, _QuinaryValidator.default.registrationBlocked, _QuinaryController.default.update); // Mostra mensagem de bloqueio de cadastro de novos sorteios

routes.get('/registration_blocked', _session.default.onlyUsers, _QuinaryValidator.default.registrationBlocked, _QuinaryController.default.registrationBlocked);
var _default = routes;
exports.default = _default;