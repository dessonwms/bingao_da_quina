"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Punter = _interopRequireDefault(require("../models/Punter"));

var _Bettings = _interopRequireDefault(require("../models/Bettings"));

var _format = _interopRequireDefault(require("../../lib/format"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const PunterController = {
  async registerForm(request, response) {
    try {
      // PAGINAÇÃO
      let {
        page,
        limit
      } = request.query;
      const {
        filter
      } = request.query;
      page = page || 1;
      limit = limit || 10;
      const offset = limit * (page - 1);
      const params = {
        filter,
        page,
        limit,
        offset,

        async callback(punters) {
          let total;

          if (punters.count !== 0) {
            var _punters$;

            total = (_punters$ = punters[0]) === null || _punters$ === void 0 ? void 0 : _punters$.total;
          } else {
            total = 0;
          } // Formata o campo de telefone para exibir na tabela


          const punterPromise = punters.map(punterList => {
            // eslint-disable-next-line no-param-reassign
            punterList.phone = _format.default.phone(punterList.phone);
            return punterList;
          });
          const punterList = await Promise.all(punterPromise);
          const pagination = {
            total: Math.ceil(total / limit),
            page
          };
          return response.render('punter/register', {
            punter: request.body,
            pagination,
            filter,
            total,
            punters: punterList
          });
        }

      };
      return _Punter.default.paginate(params);
    } catch (err) {
      return response.render('punter/register', {
        error: 'Algum erro aconteceu'
      });
    }
  },

  async post(request, response) {
    try {
      // Salva no banco de dados
      await _Punter.default.create(request.body, request.session.userId); // PAGINAÇÃO

      let {
        page,
        limit
      } = request.query;
      const {
        filter
      } = request.query;
      page = page || 1;
      limit = limit || 10;
      const offset = limit * (page - 1);
      const params = {
        filter,
        page,
        limit,
        offset,

        async callback(punters) {
          let total;

          if (punters.count !== 0) {
            var _punters$2;

            total = (_punters$2 = punters[0]) === null || _punters$2 === void 0 ? void 0 : _punters$2.total;
          } else {
            total = 0;
          } // Formata o campo de telefone para exibir na tabela


          const punterPromise = punters.map(punterList => {
            // eslint-disable-next-line no-param-reassign
            punterList.phone = _format.default.phone(punterList.phone);
            return punterList;
          });
          const punterList = await Promise.all(punterPromise);
          const pagination = {
            total: Math.ceil(total / limit),
            page
          };
          return response.render('punter/register', {
            pagination,
            filter,
            total,
            punters: punterList,
            success: 'Usuário cadastrado com sucesso!'
          });
        }

      };
      return _Punter.default.paginate(params);
    } catch (err) {
      return response.render('punter/register', {
        error: 'Algum erro aconteceu'
      });
    }
  },

  async edit(request, response) {
    try {
      const results = await _Punter.default.find(request.params.id);
      const punter = results.rows[0]; // Formata Phone para mostrar Phone com máscara no form

      punter.phone = _format.default.phone(punter.phone); // PAGINAÇÃO

      let {
        page,
        limit
      } = request.query;
      const {
        filter
      } = request.query;
      page = page || 1;
      limit = limit || 10;
      const offset = limit * (page - 1);
      const params = {
        filter,
        page,
        limit,
        offset,

        async callback(punters) {
          let total;

          if (punters.count !== 0) {
            var _punters$3;

            total = (_punters$3 = punters[0]) === null || _punters$3 === void 0 ? void 0 : _punters$3.total;
          } else {
            total = 0;
          } // Formata o campo de telefone para exibir na tabela


          const punterPromise = punters.map(punterList => {
            // eslint-disable-next-line no-param-reassign
            punterList.phone = _format.default.phone(punterList.phone);
            return punterList;
          });
          const punterList = await Promise.all(punterPromise);
          const pagination = {
            total: Math.ceil(total / limit),
            page
          };
          return response.render('punter/edit', {
            punter,
            pagination,
            filter,
            total,
            punters: punterList
          });
        }

      };
      return _Punter.default.paginate(params);
    } catch (err) {
      return response.render('punter/edit', {
        error: 'Algum erro aconteceu'
      });
    }
  },

  async update(request, response) {
    try {
      const punter = request.body;
      const {
        name,
        surname,
        phone
      } = request.body; // Atualiza os dados no banco de dados

      await _Punter.default.update(punter.id, {
        name,
        surname,
        phone: phone.replace(/\D/g, '')
      }); // PAGINAÇÃO

      let {
        page,
        limit
      } = request.query;
      const {
        filter
      } = request.query;
      page = page || 1;
      limit = limit || 10;
      const offset = limit * (page - 1);
      const params = {
        filter,
        page,
        limit,
        offset,

        async callback(punters) {
          let total;

          if (punters.count !== 0) {
            var _punters$4;

            total = (_punters$4 = punters[0]) === null || _punters$4 === void 0 ? void 0 : _punters$4.total;
          } else {
            total = 0;
          } // Formata o campo de telefone para exibir na tabela


          const punterPromise = punters.map(punterList => {
            // eslint-disable-next-line no-param-reassign
            punterList.phone = _format.default.phone(punterList.phone);
            return punterList;
          });
          const punterList = await Promise.all(punterPromise);
          const pagination = {
            total: Math.ceil(total / limit),
            page
          };
          return response.render('punter/edit', {
            punter,
            pagination,
            filter,
            total,
            punters: punterList,
            success: 'Dados atualizados com sucesso!'
          });
        }

      };
      return _Punter.default.paginate(params);
    } catch (err) {
      console.log(`Erro: ${err}`);
      return response.render('punter/edit', {
        error: 'Algum erro aconteceu'
      });
    }
  },

  async searchForm(request, response) {
    try {
      const {
        searchName,
        searchPhone,
        selectFieldSearch
      } = request.query; // Responsável por verificar qual o tipo da pesquisa

      let filter = '';

      if (selectFieldSearch === 'name') {
        filter = searchName;
      } else if (selectFieldSearch === 'phone') {
        filter = searchPhone.replace(/\D/g, '');
      } // PAGINAÇÃO


      let {
        page,
        limit
      } = request.query;
      page = page || 1;
      limit = limit || 10;
      const offset = limit * (page - 1);
      const params = {
        selectFieldSearch,
        filter,
        page,
        limit,
        offset,

        async callback(punters) {
          let total;

          if (punters.count !== 0) {
            var _punters$5;

            total = (_punters$5 = punters[0]) === null || _punters$5 === void 0 ? void 0 : _punters$5.total;
          } else {
            total = 0;
          } // Formata o campo de telefone para exibir na tabela


          const punterPromise = punters.map(punterList => {
            // eslint-disable-next-line no-param-reassign
            punterList.phone = _format.default.phone(punterList.phone);
            return punterList;
          });
          const punterList = await Promise.all(punterPromise);
          const pagination = {
            total: Math.ceil(total / limit),
            page
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
            selectFieldSearch
          });
        }

      };
      return _Punter.default.paginate(params);
    } catch (err) {
      return response.render('punter/search', {
        error: 'Algum erro aconteceu'
      });
    }
  },

  async viewBets(request, response) {
    try {
      // Busca os dados do usuário
      let results = await _Punter.default.find(request.params.id);
      const punter = results.rows[0]; // Adiciona mascará de phone

      punter.phone = _format.default.phone(punter.phone);
      console.log(punter.id); // Retorna a lista de apostas do apostador

      results = await _Bettings.default.searchBetsByBettor(punter.id);
      let bets = results.rows;
      const usersPromise = bets.map(async bet => {
        // eslint-disable-next-line no-param-reassign
        bet.created_at = _format.default.date(bet.created_at).extensive;
        return bet;
      });
      bets = await Promise.all(usersPromise);
      return response.render('punter/view_bets', {
        punter,
        bets
      });
    } catch (err) {
      return response.render('punter/view_bets', {
        error: 'Algum erro aconteceu'
      });
    }
  }

};
var _default = PunterController;
exports.default = _default;