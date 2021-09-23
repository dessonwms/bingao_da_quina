"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _session = _interopRequireDefault(require("../app/middlewares/session"));

var _BingoController = _interopRequireDefault(require("../app/controllers/BingoController"));

var _BingoValidator = _interopRequireDefault(require("../app/validators/BingoValidator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import BingoValidator from '../app/validators/BingoValidator';
const routes = (0, _express.Router)(); // Formulário de update

routes.get('/', _session.default.onlyUsers, _BingoValidator.default.filterBingo, _BingoController.default.registerForm);
routes.put('/', _session.default.onlyUsers, _BingoController.default.update); // Formulário de cadastro

routes.post('/register', _session.default.onlyUsers, _BingoController.default.post); // Lista de edições de Bingos

routes.get('/edtion_list', _BingoController.default.showList); // Resumo de informações por edição

routes.get('/:id/summary', _BingoController.default.summary); // Gera página com informações do PDF

routes.get('/:id/summary_pdf', _BingoController.default.summaryPdf); // Link para download do PDF

routes.get('/:id/download', _BingoController.default.downloadPdf);
var _default = routes;
exports.default = _default;