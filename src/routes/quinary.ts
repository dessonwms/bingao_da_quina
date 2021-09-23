import { Router } from 'express';

import QuinaryController from '../app/controllers/QuinaryController';

import Session from '../app/middlewares/session';

import QuinaryValidator from '../app/validators/QuinaryValidator';

const routes = Router();

// Formulário de cadastro de Sorteio da Quina
routes.get(
  '/register',
  Session.onlyUsers,
  QuinaryValidator.registrationBlocked,
  QuinaryController.registerForm,
);
// Salva o Sorteio da Quina no Banco
routes.post(
  '/register',
  Session.onlyUsers,
  QuinaryValidator.registrationBlocked,
  QuinaryController.post,
);

// Formulário de Edição de Sorteio da Quina
routes.get(
  '/:id/edit',
  Session.onlyUsers,
  QuinaryValidator.registrationBlocked,
  QuinaryController.edit,
);
// Atualiza o Sorteio da Quina no banco
routes.put(
  '/',
  Session.onlyUsers,
  QuinaryValidator.registrationBlocked,
  QuinaryController.update,
);

// Mostra mensagem de bloqueio de cadastro de novos sorteios
routes.get(
  '/registration_blocked',
  Session.onlyUsers,
  QuinaryValidator.registrationBlocked,
  QuinaryController.registrationBlocked,
);

export default routes;
