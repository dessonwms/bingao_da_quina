"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Bingo = _interopRequireDefault(require("../models/Bingo"));

var _Bettings = _interopRequireDefault(require("../models/Bettings"));

var _Punter = _interopRequireDefault(require("../models/Punter"));

var _format = _interopRequireDefault(require("../../lib/format"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const BetsController = {
  async selectPunter(request, response) {
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
            selectFieldSearch
          });
        }

      };
      return _Punter.default.paginate(params);
    } catch (err) {
      return response.render('betting/index', {
        error: 'Algum erro aconteceu'
      });
    }
  },

  async registerForm(request, response) {
    try {
      const userId = request.params.id; // Retorna o ID do Bingo ativo no momento

      let results = await _Bingo.default.findActive();
      const bingo = results.rows[0]; // Busca os dados do usuário

      results = await _Punter.default.find(request.params.id);
      const punter = results.rows[0]; // Adiciona mascará de phone

      punter.phone = _format.default.phone(punter.phone);
      return response.render(`betting/register`, {
        userId,
        bingoId: bingo.id,
        punter
      });
    } catch (err) {
      return response.render('betting/register', {
        error: 'Algum erro aconteceu'
      });
    }
  },

  async post(request, response) {
    try {
      const {
        userId,
        number
      } = request.body; // Retorna o ID do Bingo ativo no momento

      let results = await _Bingo.default.findActive();
      const bingo = results.rows[0]; // Salva no banco de dados

      await _Bettings.default.create(request.body, request.session.userId); // Busca os dados do usuário

      results = await _Punter.default.find(request.params.id);
      const punter = results.rows[0]; // Adiciona mascará de phone

      punter.phone = _format.default.phone(punter.phone);
      return response.render(`betting/receipt`, {
        bingoId: bingo.id,
        userId,
        numbers: number,
        punter,
        bets: request.body,
        success: 'Aposta cadastrada com sucesso!'
      });
    } catch (err) {
      return response.render('betting/receipt', {
        error: 'Algum erro aconteceu'
      });
    }
  },

  registrationBlocked(request, response) {
    return response.render('betting/blocked');
  }

};
var _default = BetsController;
exports.default = _default;