import { Router } from 'express';

import SessionController from '../app/controllers/SessionController';
import UserController from '../app/controllers/UserController';

import UserValidator from '../app/validators/UserValidator';
import SessionValidator from '../app/validators/SessionValidator';

import Session from '../app/middlewares/session';

const routes = Router();

// // login/logout
routes.get(
  '/login',
  Session.isLoggedRedirectToUsers,
  SessionController.loginForm,
);
routes.post('/login', SessionValidator.login, SessionController.login);
routes.post('/logout', SessionController.logout);

// // // reset password / forgot
routes.get('/forgot', SessionController.forgotForm);
routes.get('/password-reset', SessionController.resetForm);
routes.post('/forgot', SessionValidator.forgot, SessionController.forgot);
routes.post('/password-reset', SessionValidator.reset, SessionController.reset);

// Lista de usuários cadastrados
routes.get('/', Session.onlyUsers, UserController.show);

// Formulário de cadastro de usuário
routes.get('/register', Session.onlyUsers, UserController.registerForm);
// Salva usuário no Banco
routes.post(
  '/register',
  Session.onlyUsers,
  UserValidator.post,
  UserController.post,
);

// Formulário de Edição de usuário
routes.get(
  '/:id/edit',
  Session.onlyUsers,
  UserValidator.show,
  UserController.edit,
);
// Atualiza o usuário no banco
routes.put('/', Session.onlyUsers, UserValidator.update, UserController.update);

// Formulário de Edição My Account
routes.get('/account', Session.onlyUsers, UserController.account);
// Atualiza o usuário no banco
routes.put(
  '/account',
  Session.onlyUsers,
  UserValidator.account,
  UserController.updateAccount,
);

// routes.delete('/', UserController.delete);

export default routes;
