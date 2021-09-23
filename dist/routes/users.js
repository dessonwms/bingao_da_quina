"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _SessionController = _interopRequireDefault(require("../app/controllers/SessionController"));

var _UserController = _interopRequireDefault(require("../app/controllers/UserController"));

var _UserValidator = _interopRequireDefault(require("../app/validators/UserValidator"));

var _SessionValidator = _interopRequireDefault(require("../app/validators/SessionValidator"));

var _session = _interopRequireDefault(require("../app/middlewares/session"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const routes = (0, _express.Router)(); // // login/logout

routes.get('/login', _session.default.isLoggedRedirectToUsers, _SessionController.default.loginForm);
routes.post('/login', _SessionValidator.default.login, _SessionController.default.login);
routes.post('/logout', _SessionController.default.logout); // // // reset password / forgot

routes.get('/forgot', _SessionController.default.forgotForm);
routes.get('/password-reset', _SessionController.default.resetForm);
routes.post('/forgot', _SessionValidator.default.forgot, _SessionController.default.forgot);
routes.post('/password-reset', _SessionValidator.default.reset, _SessionController.default.reset); // Lista de usuários cadastrados

routes.get('/', _session.default.onlyUsers, _UserController.default.show); // Formulário de cadastro de usuário

routes.get('/register', _session.default.onlyUsers, _UserController.default.registerForm); // Salva usuário no Banco

routes.post('/register', _session.default.onlyUsers, _UserValidator.default.post, _UserController.default.post); // Formulário de Edição de usuário

routes.get('/:id/edit', _session.default.onlyUsers, _UserValidator.default.show, _UserController.default.edit); // Atualiza o usuário no banco

routes.put('/', _session.default.onlyUsers, _UserValidator.default.update, _UserController.default.update); // Formulário de Edição My Account

routes.get('/account', _session.default.onlyUsers, _UserController.default.account); // Atualiza o usuário no banco

routes.put('/account', _session.default.onlyUsers, _UserValidator.default.account, _UserController.default.updateAccount); // routes.delete('/', UserController.delete);

var _default = routes;
exports.default = _default;