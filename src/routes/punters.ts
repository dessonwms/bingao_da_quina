import { Router } from 'express';

import PunterController from '../app/controllers/PunterController';
import PunterValidator from '../app/validators/PunterValidator';

import Session from '../app/middlewares/session';

const routes = Router();

// Formulário de cadastro de Apostador
routes.get('/register', Session.onlyUsers, PunterController.registerForm);
// Salva o Apostador no Banco
routes.post(
  '/register',
  Session.onlyUsers,
  PunterValidator.post,
  PunterController.post,
);

// Página de pesquisa (First Time)
routes.get('/search', Session.onlyUsers, PunterController.searchForm);
// Realiza o filtro da pesquisa
// routes.post('/search', PunterController.search); // Não preicsou

// Visualiza as apostas do apostador
routes.get('/:id/view_bets', Session.onlyUsers, PunterController.viewBets);

// // Formulário de Edição de Apostador
routes.get('/:id/edit', Session.onlyUsers, PunterController.edit);
// // Atualiza o Apostador no banco
routes.put('/register', Session.onlyUsers, PunterController.update);

export default routes;
