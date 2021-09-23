import { Router } from 'express';

import Session from '../app/middlewares/session';

import ReportController from '../app/controllers/ReportController';
// import BingoValidator from '../app/validators/BingoValidator';

const routes = Router();

// Formulário de update
routes.get('/haswinner', Session.onlyUsers, ReportController.hasWinner);

export default routes;
