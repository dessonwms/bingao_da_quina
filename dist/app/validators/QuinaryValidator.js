"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Bingo = _interopRequireDefault(require("../models/Bingo"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const QuinaryValidator = {
  // eslint-disable-next-line consistent-return
  registrationBlocked: async (request, response, next) => {
    try {
      // Retorna lista de Bingos
      const results = await _Bingo.default.all();
      const numRows = results.rowCount; // Verifica se não há nenhum bingo cadastrado no sistema

      if (numRows === 0) {
        return response.render('quinary/blocked', {
          message: 'No momento ainda não há bingo cadastrado no sistema! Aguarde até a liberação do próximo Bingo.'
        });
      } // Seleciona o último registro de Bingo


      const bingo = await _Bingo.default.selectLast({
        fields: '*',
        table: 'bingos',
        orderField: 'id',
        order: 'DESC',
        limit: 1
      });

      if (bingo.status === 'FINALIZADO') {
        return response.render('quinary/blocked', {
          message: 'No momento não é possível cadastrar novos concursos da quina! Aguarde até a liberação do próximo Bingão.'
        });
      }

      if (bingo.released_bets === 'R' || bingo.released_bets === 'B') {
        return response.render('quinary/blocked', {
          message: 'Só será possível cadastrar novos Concursos da Quina quando o período de apostas for finalizado.'
        });
      }

      next();
    } catch (err) {
      return response.render('quinary/blocked', {
        error: 'Algum erro aconteceu'
      });
    }
  }
};
var _default = QuinaryValidator;
exports.default = _default;