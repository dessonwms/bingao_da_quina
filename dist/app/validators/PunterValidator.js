"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Punter = _interopRequireDefault(require("../models/Punter"));

var _format = _interopRequireDefault(require("../../lib/format"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const PunterValidator = {
  // eslint-disable-next-line consistent-return
  post: async (request, response, next) => {
    try {
      // check if user exists [email]
      let {
        phone
      } = request.body;
      phone = phone.replace(/\D/g, '');
      const punter = await _Punter.default.findOne({
        where: {
          phone
        }
      });

      if (punter) {
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
              punters: punterList,
              error: 'Esse telefone já pertence a outro usuário!'
            });
          }

        };
        return _Punter.default.paginate(params);
      }

      next();
    } catch (err) {
      return response.render('punter/register', {
        error: 'Algum erro aconteceu'
      });
    }
  }
};
var _default = PunterValidator;
exports.default = _default;