import { Router } from 'express';

import BetsController from '../app/controllers/BetsController';

const routes = Router();

// Página de seleção do apostador
routes.get('/', BetsController.selectPunter);
// Formulário de cadastro de Apostador
routes.get('/:id/register', BetsController.registerForm);
// Salva o Apostador no Banco
routes.post('/register', BetsController.post);

// // // Formulário de Edição de Apostador
// routes.get('/:id/edit', BetsController.edit);
// // // Atualiza o Apostador no banco
// routes.put('/', BetsController.update);

export default routes;
