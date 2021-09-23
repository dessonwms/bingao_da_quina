import { Router } from 'express';

import Session from '../app/middlewares/session';

import BingoController from '../app/controllers/BingoController';
import BingoValidator from '../app/validators/BingoValidator';
// import BingoValidator from '../app/validators/BingoValidator';

const routes = Router();

// Formulário de update
routes.get(
  '/',
  Session.onlyUsers,
  BingoValidator.filterBingo,
  BingoController.registerForm,
);
routes.put('/', Session.onlyUsers, BingoController.update);

// Formulário de cadastro
routes.post('/register', Session.onlyUsers, BingoController.post);

// Lista de edições de Bingos
routes.get('/edtion_list', BingoController.showList);

// Resumo de informações por edição
routes.get('/:id/summary', BingoController.summary);

// Gera página com informações do PDF
routes.get('/:id/summary_pdf', BingoController.summaryPdf);

// Link para download do PDF
routes.get('/:id/download', BingoController.downloadPdf);

export default routes;
