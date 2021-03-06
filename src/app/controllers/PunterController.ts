import PunterModel from '../models/Punter';
import BetsModel from '../models/Bettings';
import BingoModel from '../models/Bingo';

import format from '../../lib/format';

const PunterController = {
  async registerForm(request: any, response: any) {
    try {
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
          });
        },
      };

      return PunterModel.paginate(params);
    } catch (err) {
      return response.render('punter/register', {
        error: 'Algum erro aconteceu',
      });
    }
  },
  async post(request: any, response: any) {
    try {
      // Salva no banco de dados
      await PunterModel.create(request.body, request.session.userId);

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
            pagination,
            filter,
            total,
            punters: punterList,
            success: 'Usuário cadastrado com sucesso!',
          });
        },
      };

      return PunterModel.paginate(params);
    } catch (err) {
      return response.render('punter/register', {
        error: 'Algum erro aconteceu',
      });
    }
  },
  async edit(request: any, response: any) {
    try {
      const results = await PunterModel.find(request.params.id);
      const punter = results.rows[0];

      // Formata Phone para mostrar Phone com máscara no form
      punter.phone = format.phone(punter.phone);

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
          return response.render('punter/edit', {
            punter,
            pagination,
            filter,
            total,
            punters: punterList,
          });
        },
      };

      return PunterModel.paginate(params);
    } catch (err) {
      return response.render('punter/edit', {
        error: 'Algum erro aconteceu',
      });
    }
  },
  async update(request: any, response: any) {
    try {
      const punter = request.body;

      const { name, surname, phone } = request.body;

      // Atualiza os dados no banco de dados
      await PunterModel.update(punter.id, {
        name,
        surname,
        phone: phone.replace(/\D/g, ''),
      });

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
          return response.render('punter/edit', {
            punter,
            pagination,
            filter,
            total,
            punters: punterList,
            success: 'Dados atualizados com sucesso!',
          });
        },
      };
      return PunterModel.paginate(params);
    } catch (err) {
      return response.render('punter/edit', {
        error: 'Algum erro aconteceu',
      });
    }
  },
  async searchForm(request: any, response: any) {
    try {
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
          return response.render('punter/search', {
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

      return PunterModel.paginate(params);
    } catch (err) {
      return response.render('punter/search', {
        error: 'Algum erro aconteceu',
      });
    }
  },
  async viewBets(request: any, response: any) {
    try {
      // Retorna o ID do Bingo ativo no momento
      let results = await BingoModel.findActive();
      const bingo = results.rows[0];

      // Busca os dados do usuário
      results = await PunterModel.find(request.params.id);
      const punter = results.rows[0];
      // Adiciona mascará de phone
      punter.phone = format.phone(punter.phone);

      // Retorna a lista de apostas do apostador
      results = await BetsModel.searchBetsByBettor(bingo.id, punter.id);
      let bets = results.rows;
      const numBets = results.rowCount;

      const usersPromise = bets.map(async bet => {
        // eslint-disable-next-line no-param-reassign
        bet.created_at = format.date(bet.created_at).extensive;
        return bet;
      });
      bets = await Promise.all(usersPromise);

      return response.render('punter/view_bets', {
        punter,
        bets,
        numBets,
      });
    } catch (err) {
      return response.render('punter/view_bets', {
        error: 'Algum erro aconteceu',
      });
    }
  },
};

export default PunterController;
