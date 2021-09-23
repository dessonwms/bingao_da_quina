"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Bingo = _interopRequireDefault(require("../models/Bingo"));

var _Quinary = _interopRequireDefault(require("../models/Quinary"));

var _Report = _interopRequireDefault(require("../models/Report"));

var _format = _interopRequireDefault(require("../../lib/format"));

var _summaryValues = _interopRequireDefault(require("../../lib/summaryValues"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const HomeController = {
  async index(request, response) {
    // Seleciona o último registro de Bingo
    const bingo = await _Bingo.default.selectLast({
      fields: '*',
      table: 'bingos',
      orderField: 'id',
      order: 'DESC',
      limit: 1
    });
    bingo.start_date = _format.default.date(bingo.start_date).ptbr;

    if (bingo.end_date) {
      bingo.end_date = _format.default.date(bingo.end_date).ptbr;
    } // Retorna o total de apostas registradas no sistema


    const totalBets = await _Report.default.totalRegister({
      table: 'bettings',
      bingoId: bingo.id,
      limit: 1
    }); // Retorna os dados de ranking de acertos

    let results = await _Report.default.rankingHome(bingo.id);
    const ratings = results.rows; // Cálculos de resumo do bingo

    const summary = {
      totalBets: totalBets.count,
      valueBets: _format.default.formatPrice(_summaryValues.default.valueBet),
      grandTotal: _format.default.formatPrice(_summaryValues.default.grandTotal(totalBets.count)),
      administrationFee: _format.default.formatPrice(_summaryValues.default.administrationFee(_summaryValues.default.grandTotal(totalBets.count))),
      firstPlaceAward: _format.default.formatPrice(_summaryValues.default.firstPlaceAward(_summaryValues.default.grandTotal(totalBets.count))),
      secondPlaceAward: _format.default.formatPrice(_summaryValues.default.secondPlaceAward(_summaryValues.default.grandTotal(totalBets.count))),
      minorHitAward: _format.default.formatPrice(_summaryValues.default.minorHitAward(_summaryValues.default.grandTotal(totalBets.count))),
      prizeForTenHits: _format.default.formatPrice(_summaryValues.default.prizePerWinner(ratings, 10, _summaryValues.default.firstPlaceAward(_summaryValues.default.grandTotal(totalBets.count)))),
      prizeForNineHits: _format.default.formatPrice(_summaryValues.default.prizePerWinner(ratings, 9, _summaryValues.default.secondPlaceAward(_summaryValues.default.grandTotal(totalBets.count)))),
      prizeMinorHit: _format.default.formatPrice(_summaryValues.default.prizePerWinner(ratings, ratings[0].minimo, _summaryValues.default.minorHitAward(_summaryValues.default.grandTotal(totalBets.count))))
    }; // TRATA DADOS PARA EXIBIÇÃO NA TABELA DE RANKING

    const dataSummary = _summaryValues.default.generateRankingData(ratings); // Retorna a lista dos últimos sorteios da quina


    results = await _Quinary.default.all(bingo.id);
    const quinarys = results.rows; // Altera os valores dos campos que precisam de formatação
    // eslint-disable-next-line no-shadow

    const quinarysPromise = quinarys.map(async quinary => {
      // eslint-disable-next-line no-param-reassign
      quinary.contestdata = _format.default.date(quinary.contestdata).ptbr;
      return quinary;
    });
    const quinarysList = await Promise.all(quinarysPromise);
    return response.render('home/index.njk', {
      dataSummary,
      totalRatings: dataSummary.length,
      bingo,
      ratings,
      summary,
      quinarys: quinarysList
    });
  }

};
var _default = HomeController;
exports.default = _default;