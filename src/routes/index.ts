import { Router } from 'express';

const routes = Router();

routes.get('/', (request, response) =>
  response.render('index', { name: 'Desson' }),
);

export default routes;
