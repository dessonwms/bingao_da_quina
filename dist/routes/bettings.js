"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _BettingsController = _interopRequireDefault(require("../app/controllers/BettingsController"));

var _session = _interopRequireDefault(require("../app/middlewares/session"));

var _BettingValidator = _interopRequireDefault(require("../app/validators/BettingValidator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const routes = (0, _express.Router)(); // Página de seleção do apostador

routes.get('/', _session.default.onlyUsers, _BettingValidator.default.registrationBlocked, _BettingsController.default.selectPunter); // Formulário de cadastro de Apostador

routes.get('/:id/register', _session.default.onlyUsers, _BettingValidator.default.registrationBlocked, _BettingsController.default.registerForm); // Salva o Apostador no Banco

routes.post('/:id/register', _session.default.onlyUsers, _BettingValidator.default.registrationBlocked, _BettingsController.default.post); // Mostra mensagem de bloqueio de cadastro de novas apostas

routes.get('/registration_blocked', _session.default.onlyUsers, _BettingsController.default.registrationBlocked); // // // Formulário de Edição de Apostador
// routes.get('/:id/edit', BetsController.edit);
// // // Atualiza o Apostador no banco
// routes.put('/', BetsController.update);

var _default = routes;
exports.default = _default;