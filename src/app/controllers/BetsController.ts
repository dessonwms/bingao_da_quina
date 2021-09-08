// import BetsModel from '../models/Bets';
import PunterModel from '../models/Punter';

import format from '../../lib/utils';

const BetsController = {
  async selectPunter(request: any, response: any) {
    const { searchName, searchPhone, selectFieldSearch } = request.query;

    // Responsável por verificar qual o tipo da pesquisa
    let filter = '';

    if (selectFieldSearch === 'name') {
      filter = searchName;
    } else if (selectFieldSearch === 'phone') {
      filter = searchPhone.replace(/\D/g, '');
    }

    // PAGINAÇÃO
    let { page, limit } = request.query;

    page = page || 1;
    limit = limit || 10;
    const offset = limit * (page - 1);

    const params = {
      selectFieldSearch,
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
        return response.render('bet/index', {
          punter: request.body,
          pagination,
          filter,
          searchName,
          searchPhone,
          total,
          punters: punterList,
          name: searchName,
          phone: searchPhone,
          selectFieldSearch,
        });
      },
    };

    PunterModel.paginate(params);
  },
  async registerForm(request: any, response: any) {
    const userId = request.params.id;

    console.log(`userId: ${userId}`);

    return response.render(`bet/register`, { userId });
  },
  async post(request: any, response: any) {
    const { userId, number } = request.body;

    console.log(`userId: ${userId}`);

    console.log(`number: ${number[0]}`);

    return response.render(`bet/register`, {
      userId,
      success: 'Aposta cadastrada com sucesso!',
    });
  },
};

export default BetsController;
