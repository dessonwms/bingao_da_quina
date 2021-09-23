"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Bingo = _interopRequireDefault(require("../models/Bingo"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const BingoValidator = {
  // eslint-disable-next-line consistent-return
  filterBingo: async (request, response, next) => {
    try {
      // Seleciona o último registro de Bingo
      // Retorna lista de Bingos
      const results = await _Bingo.default.all();
      const numRows = results.rowCount;

      if (numRows === 0) {
        return response.render('bingo/first_register');
      }

      next();
    } catch (err) {
      return response.render('bingo/index', {
        error: 'Algum erro aconteceu'
      });
    }
  }
};
var _default = BingoValidator;
exports.default = _default;