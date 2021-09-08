import { Router } from 'express';

import QuinaryController from '../app/controllers/QuinaryController';

const routes = Router();

// Formulário de cadastro de Sorteio da Quina
routes.get('/register', QuinaryController.registerForm);
// Salva o Sorteio da Quina no Banco
routes.post('/register', QuinaryController.post);

// Formulário de Edição de Sorteio da Quina
routes.get('/:id/edit', QuinaryController.edit);
// Atualiza o Sorteio da Quina no banco
routes.put('/', QuinaryController.update);

export default routes;
