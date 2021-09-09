import BetsModel from '../models/Bettings';
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
        return response.render('betting/index', {
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

    // Busca os dados do usuário
    const results = await PunterModel.find(request.params.id);
    const punter = results.rows[0];
    // Adiciona mascará de phone
    punter.phone = format.phone(punter.phone);

    return response.render(`betting/register`, {
      userId,
      punter,
    });
  },
  async post(request: any, response: any) {
    const { userId, number } = request.body;

    // Salva no banco de dados
    await BetsModel.create(request.body, request.session.userId);

    // Busca os dados do usuário
    const results = await PunterModel.find(request.params.id);
    const punter = results.rows[0];
    // Adiciona mascará de phone
    punter.phone = format.phone(punter.phone);

    return response.render(`betting/receipt`, {
      userId,
      numbers: number,
      punter,
      bets: request.body,
      success: 'Aposta cadastrada com sucesso!',
    });
  },
};

export default BetsController;
