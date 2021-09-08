import PunterModel from '../models/Punter';

import format from '../../lib/utils';

const PunterValidator = {
  // eslint-disable-next-line consistent-return
  post: async (request: any, response: any, next: any) => {
    // check if user exists [email]
    let { phone } = request.body;
    phone = phone.replace(/\D/g, '');
    const punter = await PunterModel.findOne({ where: { phone } });

    console.log(request.body);

    if (punter) {
      // Retorna lista de Apostadores
      const results = await PunterModel.all();
      const punters = results.rows;

      // eslint-disable-next-line no-shadow
      const punterPromise = punters.map(async punter => {
        // eslint-disable-next-line no-param-reassign
        punter.phone = format.phone(punter.phone);
        return punter;
      });
      const punterList = await Promise.all(punterPromise);

      return response.render('punter/register', {
        punter: request.body,
        punters: punterList,
        error: 'Esse telefone já pertence a outro usuário!',
      });
    }

    next();
  },
};

export default PunterValidator;
