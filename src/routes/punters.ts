import { Router } from 'express';

import PunterController from '../app/controllers/PunterController';
import PunterValidator from '../app/validators/PunterValidator';

const routes = Router();

// Formulário de cadastro de Apostador
routes.get('/register', PunterController.registerForm);
// Salva o Apostador no Banco
routes.post('/register', PunterValidator.post, PunterController.post);

// Página de pesquisa (First Time)
routes.get('/search', PunterController.searchForm);
// Realiza o filtro da pesquisa
// routes.post('/search', PunterController.search); // Não preicsou

// // Formulário de Edição de Apostador
routes.get('/:id/edit', PunterController.edit);
// // Atualiza o Apostador no banco
routes.put('/register', PunterController.update);

export default routes;
