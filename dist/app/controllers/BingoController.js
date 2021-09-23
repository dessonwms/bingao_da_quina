"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _path = _interopRequireDefault(require("path"));

var _Bingo = _interopRequireDefault(require("../models/Bingo"));

var _Quinary = _interopRequireDefault(require("../models/Quinary"));

var _Bettings = _interopRequireDefault(require("../models/Bettings"));

var _Report = _interopRequireDefault(require("../models/Report"));

var _globalInfo = _interopRequireDefault(require("../../config/globalInfo"));

var _format = _interopRequireDefault(require("../../lib/format"));

var _verifyWinner = _interopRequireDefault(require("../../lib/verifyWinner"));

var _summaryValues = _interopRequireDefault(require("../../lib/summaryValues"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const HomeController = {
  async registerForm(request, response) {
    try {
      // Cria data atual para popular o campo date no formulário
      const date = _format.default.date(Date.now()).iso; // Seleciona o último registro de Bingo


      const bingo = await _Bingo.default.selectLast({
        fields: '*',
        table: 'bingos',
        orderField: 'id',
        order: 'DESC',
        limit: 1
      });

      if (!bingo.start_date) {
        bingo.start_date = date;
      } else {
        bingo.start_date = _format.default.date(bingo.start_date).iso;
      }

      if (bingo.end_date) {
        bingo.end_date = _format.default.date(bingo.end_date).iso;
      } // Retorna lista de Bingos


      const results = await _Bingo.default.all();
      let bingoList = results.rows;
      const usersPromise = bingoList.map(async bingos => {
        // eslint-disable-next-line no-param-reassign
        bingos.start_date = _format.default.date(bingos.start_date).ptbr;

        if (bingos.end_date !== null) {
          // eslint-disable-next-line no-param-reassign
          bingos.end_date = _format.default.date(bingos.end_date).ptbr;
        }

        return bingos;
      });
      bingoList = await Promise.all(usersPromise);
      return response.render('bingo/index', {
        bingo,
        bingoList
      });
    } catch (err) {
      console.error(err);
      return response.render('bingo/index', {
        error: 'Algum erro aconteceu'
      });
    }
  },

  async post(request, response) {
    try {
      // Cria data atual para popular o campo date no formulário
      request.body.start_date = _format.default.date(Date.now()).iso; // Gerencia número da edição (verificando se é a primeira edição cadastrada)
      // const { firstRegister } = request.body.first_register;

      if (!request.body.first_register) {
        request.body.edition = parseInt(request.body.edition, 10) + 1;
      } // Salva no banco de dados


      await _Bingo.default.create(request.body, request.session.userId); // Seleciona o último registro de Bingo

      const bingo = await _Bingo.default.selectLast({
        fields: '*',
        table: 'bingos',
        orderField: 'id',
        order: 'DESC',
        limit: 1
      });
      bingo.start_date = _format.default.date(bingo.start_date).iso; // Retorna lista de administradores

      const results = await _Bingo.default.all();
      let bingoList = results.rows;
      console.log(bingoList);
      const usersPromise = bingoList.map(async bingos => {
        // eslint-disable-next-line no-param-reassign
        bingos.start_date = _format.default.date(bingos.start_date).ptbr;

        if (bingos.end_date !== null) {
          // eslint-disable-next-line no-param-reassign
          bingos.end_date = _format.default.date(bingos.end_date).ptbr;
        }

        return bingos;
      });
      bingoList = await Promise.all(usersPromise);
      return response.render('bingo/index', {
        bingo,
        bingoList,
        success: 'Bingo cadastrado com sucesso!'
      });
    } catch (err) {
      console.error(err);
      return response.render('bingo/index', {
        error: 'Algum erro aconteceu'
      });
    }
  },

  async update(request, response) {
    try {
      const bingo = request.body; // eslint-disable-next-line camelcase

      const {
        edition,
        status,
        released_bets
      } = request.body;
      await _Bingo.default.update(bingo.id, {
        edition,
        status,
        released_bets,
        user_id: request.session.userId
      });
      bingo.start_date = _format.default.date(bingo.start_date).iso; // Retorna lista de administradores

      const results = await _Bingo.default.all();
      let bingoList = results.rows;
      const usersPromise = bingoList.map(async bingos => {
        // eslint-disable-next-line no-param-reassign
        bingos.start_date = _format.default.date(bingos.start_date).ptbr; // eslint-disable-next-line no-param-reassign

        if (bingos.end_date !== null) {
          // eslint-disable-next-line no-param-reassign
          bingos.end_date = _format.default.date(bingos.end_date).ptbr;
        }

        return bingos;
      });
      bingoList = await Promise.all(usersPromise);
      return response.render('bingo/index', {
        bingo,
        bingoList,
        success: 'Dados atualizados com sucesso!'
      });
    } catch (err) {
      console.error(err);
      return response.render('bingo/index', {
        error: 'Algum erro aconteceu'
      });
    }
  },

  async showList(request, response) {
    // Retorna lista de Bingos
    const results = await _Bingo.default.all();
    let bingoList = results.rows;
    const usersPromise = bingoList.map(async bingos => {
      // eslint-disable-next-line no-param-reassign
      bingos.start_date = _format.default.date(bingos.start_date).ptbr;

      if (bingos.end_date !== null) {
        // eslint-disable-next-line no-param-reassign
        bingos.end_date = _format.default.date(bingos.end_date).ptbr;
      }

      return bingos;
    });
    bingoList = await Promise.all(usersPromise);
    return response.render('bingo/edition_list', {
      bingoList
    });
  },

  async summary(request, response) {
    try {
      // Busca os dados do bingo
      let results = await _Bingo.default.find(request.params.id);
      const bingo = results.rows[0]; // Retorna a lista dos últimos sorteios da quina

      results = await _Quinary.default.all(bingo.id);
      let quinarys = results.rows; // Retorna lista com todas as 80 dezenas da Quina

      results = await _Quinary.default.allTen();
      const quinaryTens = results.rows; // Concatena valores dos sorteios retirando as duplicatas

      const noDuplicates = _verifyWinner.default.concatenateWithoutDuplicates(quinarys); // Altera os valores dos campos que precisam de formatação
      // eslint-disable-next-line no-shadow


      const quinarysPromise = quinarys.map(async quinary => {
        // eslint-disable-next-line no-param-reassign
        quinary.contestdata = _format.default.date(quinary.contestdata).ptbr;
        return quinary;
      });
      quinarys = await Promise.all(quinarysPromise); // Retorna o total de apostas registradas no sistema

      const totalBets = await _Report.default.totalRegister({
        table: 'bettings',
        bingoId: bingo.id,
        limit: 1
      }); // Retorna os dados de ranking de acertos

      results = await _Report.default.rankingHome(bingo.id);
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

      const dataSummary = _summaryValues.default.generateRankingData(ratings); // PAGINAÇÃO DE APOSTAS


      let {
        page
      } = request.query;
      page = page || 1;
      const limit = 10;
      const offset = limit * (page - 1);
      const params = {
        bingoId: bingo.id,
        page,
        limit,
        offset,

        async callback(bettings) {
          let total;

          if (bettings.count !== 0) {
            var _bettings$;

            total = (_bettings$ = bettings[0]) === null || _bettings$ === void 0 ? void 0 : _bettings$.total;
          } else {
            total = 0;
          }

          const pagination = {
            total: Math.ceil(total / limit),
            page
          };
          return response.render('bingo/summary', {
            dataSummary,
            totalRatings: dataSummary.length,
            ratings,
            summary,
            bingo,
            quinarys,
            quinaryTens,
            noDuplicates,
            bettings,
            pagination,
            total
          });
        }

      };
      return _Bettings.default.paginate(params);
    } catch (err) {
      console.error(err);
      return response.render('bingo/index', {
        error: 'Algum erro aconteceu'
      });
    }
  },

  async summaryPdf(request, response) {
    try {
      // Busca os dados do bingo
      let results = await _Bingo.default.find(request.params.id);
      const bingo = results.rows[0]; // Retorna a lista dos últimos sorteios da quina

      results = await _Quinary.default.all(bingo.id);
      let quinarys = results.rows; // Retorna lista com todas as 80 dezenas da Quina

      results = await _Quinary.default.allTen();
      const quinaryTens = results.rows; // Concatena valores dos sorteios retirando as duplicatas

      const noDuplicates = _verifyWinner.default.concatenateWithoutDuplicates(quinarys); // Altera os valores dos campos que precisam de formatação
      // eslint-disable-next-line no-shadow


      const quinarysPromise = quinarys.map(async quinary => {
        // eslint-disable-next-line no-param-reassign
        quinary.contestdata = _format.default.date(quinary.contestdata).ptbr;
        return quinary;
      });
      quinarys = await Promise.all(quinarysPromise); // Retorna lista de todas as apostas referentes a edição atual do Bingo

      results = await _Bettings.default.summaryPdf(bingo.id);
      const bettings = results.rows; // Retorna o total de apostas registradas no sistema

      const totalBets = await _Report.default.totalRegister({
        table: 'bettings',
        bingoId: bingo.id,
        limit: 1
      }); // Retorna os dados de ranking de acertos

      results = await _Report.default.rankingHome(bingo.id);
      const ratings = results.rows; // Cálculos de resumo do bingo

      const summary = {
        totalBets: totalBets.count,
        valueBets: _format.default.formatPrice(_summaryValues.default.valueBet),
        grandTotal: _format.default.formatPrice(_summaryValues.default.grandTotal(totalBets.count)),
        administrationFee: _format.default.formatPrice(_summaryValues.default.administrationFee(_summaryValues.default.grandTotal(totalBets.count))),
        firstPlaceAward: _format.default.formatPrice(_summaryValues.default.firstPlaceAward(_summaryValues.default.grandTotal(totalBets.count))),
        secondPlaceAward: _format.default.formatPrice(_summaryValues.default.secondPlaceAward(_summaryValues.default.grandTotal(totalBets.count))),
        minorHitAward: _format.default.formatPrice(_summaryValues.default.minorHitAward(_summaryValues.default.grandTotal(totalBets.count))),
        prizeTotal: _format.default.formatPrice(_summaryValues.default.prizeTotal(_summaryValues.default.grandTotal(totalBets.count))),
        prizeForTenHits: _format.default.formatPrice(_summaryValues.default.prizePerWinner(ratings, 10, _summaryValues.default.firstPlaceAward(_summaryValues.default.grandTotal(totalBets.count)))),
        prizeForNineHits: _format.default.formatPrice(_summaryValues.default.prizePerWinner(ratings, 9, _summaryValues.default.secondPlaceAward(_summaryValues.default.grandTotal(totalBets.count)))),
        prizeMinorHit: _format.default.formatPrice(_summaryValues.default.prizePerWinner(ratings, ratings[0].minimo, _summaryValues.default.minorHitAward(_summaryValues.default.grandTotal(totalBets.count))))
      }; // TRATA DADOS PARA EXIBIÇÃO NA TABELA DE RANKING

      const dataSummary = _summaryValues.default.generateRankingData(ratings);

      return response.render('bingo/summary_pdf/index', {
        dataSummary,
        totalRatings: dataSummary.length,
        ratings,
        summary,
        bingo,
        quinarys,
        quinaryTens,
        noDuplicates,
        bettings,
        globalInfo: _globalInfo.default
      });
    } catch (err) {
      console.error(err);
      return response.render('bingo/summary_pdf/index', {
        error: 'Algum erro aconteceu'
      });
    }
  },

  async downloadPdf(request, response) {
    const {
      id
    } = request.params;
    const results = await _Bingo.default.find(id);
    const bingo = results.rows[0];

    const pathPdf = _path.default.join(__dirname, '..', '..', '..', 'temp');

    response.type('pdf');
    response.download(`${pathPdf}/bingao_da_quina_edicao_${bingo.edition}.pdf`);
  }

};
var _default = HomeController;
exports.default = _default;