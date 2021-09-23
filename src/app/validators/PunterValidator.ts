import PunterModel from '../models/Punter';

import format from '../../lib/format';

const PunterValidator = {
  // eslint-disable-next-line consistent-return
  post: async (request: any, response: any, next: any) => {
    try {
      // check if user exists [email]
      let { phone } = request.body;
      phone = phone.replace(/\D/g, '');
      const punter = await PunterModel.findOne({ where: { phone } });

      if (punter) {
        // PAGINAÇÃO
        let { page, limit } = request.query;
        const { filter } = request.query;

        page = page || 1;
        limit = limit || 10;
        const offset = limit * (page - 1);

        const params = {
          filter,
          page,
          limit,
          offset,
          async callback(punters: any) {
            let total;

            if (punters.count !== 0) {
              total = punters[0]?.total;
            } else {
              total = 0;
            }

            // Formata o campo de telefone para exibir na tabela
            const punterPromise = punters.map((punterList: { phone: any }) => {
              // eslint-disable-next-line no-param-reassign
              punterList.phone = format.phone(punterList.phone);
              return punterList;
            });
            const punterList = await Promise.all(punterPromise);

            const pagination = {
              total: Math.ceil(total / limit),
              page,
            };
            return response.render('punter/register', {
              punter: request.body,
              pagination,
              filter,
              total,
              punters: punterList,
              error: 'Esse telefone já pertence a outro usuário!',
            });
          },
        };

        return PunterModel.paginate(params);
      }

      next();
    } catch (err) {
      return response.render('punter/register', {
        error: 'Algum erro aconteceu',
      });
    }
  },
};

export default PunterValidator;
