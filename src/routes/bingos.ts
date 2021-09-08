import { Router } from 'express';

import Session from '../app/middlewares/session';

import BingoController from '../app/controllers/BingoController';
// import BingoValidator from '../app/validators/BingoValidator';

const routes = Router();

// Formulário de cadastro de usuário
routes.get('/', Session.onlyUsers, BingoController.registerForm);
routes.put('/', Session.onlyUsers, BingoController.update);

export default routes;
