import { Router } from 'express';

import BettingsController from '../app/controllers/BettingsController';

const routes = Router();

// Página de seleção do apostador
routes.get('/', BettingsController.selectPunter);
// Formulário de cadastro de Apostador
routes.get('/:id/register', BettingsController.registerForm);
// Salva o Apostador no Banco
routes.post('/:id/register', BettingsController.post);

// // // Formulário de Edição de Apostador
// routes.get('/:id/edit', BetsController.edit);
// // // Atualiza o Apostador no banco
// routes.put('/', BetsController.update);

export default routes;
