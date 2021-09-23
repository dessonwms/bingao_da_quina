"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Quinary = _interopRequireDefault(require("../models/Quinary"));

var _Bingo = _interopRequireDefault(require("../models/Bingo"));

var _verifyWinner = _interopRequireDefault(require("../../lib/verifyWinner"));

var _Report = _interopRequireDefault(require("../models/Report"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ReportController = {
  async hasWinner(request, response) {
    try {
      // Retorna o ID do Bingo ativo no momento
      let results = await _Bingo.default.findActive();
      const bingo = results.rows[0]; // Retorna a lista dos últimos sorteios

      results = await _Quinary.default.all(bingo.id);
      const quinarys = results.rows; // Concatena valores dos sorteios retirando as duplicatas

      const noDuplicates = _verifyWinner.default.concatenateWithoutDuplicates(quinarys); // Retorna registros na tabela de winners passiveis de premiação


      results = await _Report.default.onlyWinners(bingo.id);
      const onlyWinners = results.rows;
      return response.render('report/has_winner.njk', {
        onlyWinners,
        noDuplicates
      });
    } catch (err) {
      console.log(`Error: ${err}`);
      return `Error: ${err}`;
    }
  }

};
var _default = ReportController;
exports.default = _default;