import { Router } from 'express';

import users from './users';
import bingos from './bingos';
import punters from './punters';
import quinary from './quinary';
import bets from './bets';
import HomeController from '../app/controllers/HomeController';
import Session from '../app/middlewares/session';

const routes = Router();

// Home
routes.get('/', Session.onlyUsers, HomeController.index);

// Users
routes.use('/users', users);

// Bingo
routes.use('/bingos', bingos);

// Punter
routes.use('/punters', punters);

// Quinary
routes.use('/quinarys', quinary);

// Bets
routes.use('/bets', bets);

export default routes;
