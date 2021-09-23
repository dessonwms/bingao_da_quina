import { Router } from 'express';

import BettingsController from '../app/controllers/BettingsController';

import Session from '../app/middlewares/session';

import BettingValidator from '../app/validators/BettingValidator';

const routes = Router();

// Página de seleção do apostador
routes.get(
  '/',
  Session.onlyUsers,
  BettingValidator.registrationBlocked,
  BettingsController.selectPunter,
);
// Formulário de cadastro de Apostador
routes.get(
  '/:id/register',
  Session.onlyUsers,
  BettingValidator.registrationBlocked,
  BettingsController.registerForm,
);
// Salva o Apostador no Banco
routes.post(
  '/:id/register',
  Session.onlyUsers,
  BettingValidator.registrationBlocked,
  BettingsController.post,
);

// Mostra mensagem de bloqueio de cadastro de novas apostas
routes.get(
  '/registration_blocked',
  Session.onlyUsers,
  BettingsController.registrationBlocked,
);

// // // Formulário de Edição de Apostador
// routes.get('/:id/edit', BetsController.edit);
// // // Atualiza o Apostador no banco
// routes.put('/', BetsController.update);

export default routes;
