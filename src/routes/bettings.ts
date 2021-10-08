import { Router } from 'express';

import BettingsController from '../app/controllers/BettingsController';

import Session from '../app/middlewares/session';

import BettingValidator from '../app/validators/BettingValidator';

const routes = Router();

// Página de seleção do apostador
routes.get(
  '/add_bet',
  Session.onlyUsers,
  BettingValidator.registrationBlocked,
  BettingsController.selectPunter,
);
// Formulário de cadastro de aposta
routes.get(
  '/:id/register',
  Session.onlyUsers,
  BettingValidator.registrationBlocked,
  BettingsController.registerForm,
);
// Salva o Aposta no Banco
routes.post(
  '/:id/register',
  Session.onlyUsers,
  BettingValidator.registrationBlocked,
  BettingsController.post,
);

// Formulário de atualização de aposta
routes.get(
  '/:id/edit',
  Session.onlyUsers,
  BettingValidator.registrationBlocked,
  BettingsController.edit,
);
// Atualiza os dados da Aposta no Banco
routes.put(
  '/:id/edit',
  Session.onlyUsers,
  BettingValidator.registrationBlocked,
  BettingsController.update,
);

// Lista de Apostas referente ao bingo ativo
routes.get('/list_bet', Session.onlyUsers, BettingsController.summary);

// Mostra mensagem de bloqueio de cadastro de novas apostas
routes.get(
  '/registration_blocked',
  Session.onlyUsers,
  BettingsController.registrationBlocked,
);

// Salva o Aposta no Banco
routes.get('/:punter/:id/delete', Session.onlyUsers, BettingsController.delete);

// // // Formulário de Edição de Apostador
// routes.get('/:id/edit', BetsController.edit);
// // // Atualiza o Apostador no banco
// routes.put('/', BetsController.update);

export default routes;
