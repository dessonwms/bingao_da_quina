import { Router } from 'express';

import users from './users';
import bingos from './bingos';
import punters from './punters';
import quinary from './quinary';
import bettings from './bettings';
import reports from './reports';
import HomeController from '../app/controllers/HomeController';
import Session from '../app/middlewares/session';

import BingoValidator from '../app/validators/BingoValidator';

const routes = Router();

// Home
routes.get(
  '/',
  Session.onlyUsers,
  BingoValidator.filterBingo,
  HomeController.index,
);

// Users
routes.use('/users', users);

// Bingo
routes.use('/bingos', bingos);

// Punter
routes.use('/punters', punters);

// Quinary
routes.use('/quinarys', quinary);

// Bets
routes.use('/bettings', bettings);

// Reports
routes.use('/reports', reports);

export default routes;
