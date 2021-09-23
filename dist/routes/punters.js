"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _PunterController = _interopRequireDefault(require("../app/controllers/PunterController"));

var _PunterValidator = _interopRequireDefault(require("../app/validators/PunterValidator"));

var _session = _interopRequireDefault(require("../app/middlewares/session"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const routes = (0, _express.Router)(); // Formulário de cadastro de Apostador

routes.get('/register', _session.default.onlyUsers, _PunterController.default.registerForm); // Salva o Apostador no Banco

routes.post('/register', _session.default.onlyUsers, _PunterValidator.default.post, _PunterController.default.post); // Página de pesquisa (First Time)

routes.get('/search', _session.default.onlyUsers, _PunterController.default.searchForm); // Realiza o filtro da pesquisa
// routes.post('/search', PunterController.search); // Não preicsou
// Visualiza as apostas do apostador

routes.get('/:id/view_bets', _session.default.onlyUsers, _PunterController.default.viewBets); // // Formulário de Edição de Apostador

routes.get('/:id/edit', _session.default.onlyUsers, _PunterController.default.edit); // // Atualiza o Apostador no banco

routes.put('/register', _session.default.onlyUsers, _PunterController.default.update);
var _default = routes;
exports.default = _default;