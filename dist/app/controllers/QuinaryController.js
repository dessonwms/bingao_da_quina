"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _nunjucks = _interopRequireDefault(require("nunjucks"));

var _puppeteer = _interopRequireDefault(require("puppeteer"));

var _path = _interopRequireDefault(require("path"));

var _Quinary = _interopRequireDefault(require("../models/Quinary"));

var _Bettings = _interopRequireDefault(require("../models/Bettings"));

var _Bingo = _interopRequireDefault(require("../models/Bingo"));

var _Report = _interopRequireDefault(require("../models/Report"));

var _globalInfo = _interopRequireDefault(require("../../config/globalInfo"));

var _format = _interopRequireDefault(require("../../lib/format"));

var _verifyWinner = _interopRequireDefault(require("../../lib/verifyWinner"));

var _summaryValues = _interopRequireDefault(require("../../lib/summaryValues"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable camelcase */
const PunterController = {
  async registerForm(request, response) {
    try {
      // Retorna o ID do Bingo ativo no momento
      let results = await _Bingo.default.findActive();
      const bingo = results.rows[0]; // Retorna a lista dos últimos sorteios

      results = await _Quinary.default.all(bingo.id);
      const quinarys = results.rows;
      const numRows = results.rowCount; // Altera os valores dos campos que precisam de formatação
      // eslint-disable-next-line no-shadow

      const quinarysPromise = quinarys.map(async quinary => {
        // eslint-disable-next-line no-param-reassign
        quinary.contestdata = _format.default.date(quinary.contestdata).birthDay;
        return quinary;
      });
      const quinarysList = await Promise.all(quinarysPromise);
      return response.render('quinary/register', {
        quinarys: quinarysList,
        numRows,
        bingoId: bingo.id
      });
    } catch (err) {
      return response.render('quinary/register', {
        error: 'Algum erro aconteceu'
      });
    }
  },

  async post(request, response) {
    try {
      // Salva no banco de dados
      // await QuinaryModel.create(request.body);
      // Retorna o ID do Bingo ativo no momento
      let results = await _Bingo.default.findActive();
      const bingo = results.rows[0]; // Retorna a lista dos últimos sorteios

      results = await _Quinary.default.all(bingo.id);
      const quinarys = results.rows; // Altera os valores dos campos que precisam de formatação
      // eslint-disable-next-line no-shadow

      const quinarysPromise = quinarys.map(async quinary => {
        // eslint-disable-next-line no-param-reassign
        quinary.contestdata = _format.default.date(quinary.contestdata).ptbr;
        return quinary;
      });
      const quinarysList = await Promise.all(quinarysPromise); // Concatena valores dos sorteios retirando as duplicatas

      const noDuplicates = _verifyWinner.default.concatenateWithoutDuplicates(quinarys); // Retorna lista de apostas


      results = await _Bettings.default.all(bingo.id);
      const bettings = results.rows; // SALVA INFORMAÇÕES DE GANHADORES NA TABELA DE WINNERS

      const hasData = await _Report.default.checkForRecords(bingo.id);

      if (hasData.rowCount === 0) {
        const resultData = []; // Conta quntidade de ecertos e salva no banco

        for (let i = 0; i < bettings.length; i += 1) {
          const dataWinner = _verifyWinner.default.dataWinner(bettings[i], noDuplicates); // Cria um array de promises


          resultData.push(_Report.default.saveDataWinner(dataWinner));
        } // Executa o array de promises


        await Promise.all(resultData);
      } else {
        const resultData = [];

        for (let i = 0; i < bettings.length; i += 1) {
          const dataWinner = _verifyWinner.default.dataWinner(bettings[i], noDuplicates); // Cria um array de promises


          resultData.push(_Report.default.updateDataWinner(dataWinner, {
            number_hits: dataWinner.numberHits
          }));
        }

        await Promise.all(resultData);
      } // Retorna lista de todas as apostas referentes a edição atual do Bingo


      results = await _Bettings.default.summaryPdf(bingo.id);
      const bettingsPdf = results.rows; // GERA E FORMATA DADOS PARA EXIBIÇÃO NO PDF
      // Retorna lista com todas as 80 dezenas da Quina

      results = await _Quinary.default.allTen();
      const quinaryTens = results.rows; // Retorna o total de apostas registradas no sistema

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

      const dataSummary = _summaryValues.default.generateRankingData(ratings); // GERA PDF


      _nunjucks.default.render('bingo/summary_pdf/index.njk', {
        dataSummary,
        totalRatings: dataSummary.length,
        ratings,
        summary,
        bingo,
        quinarys,
        quinaryTens,
        noDuplicates,
        bettings: bettingsPdf,
        globalInfo: _globalInfo.default
      }, // eslint-disable-next-line consistent-return
      async (error, html) => {
        if (error) {
          console.log(`Erro: ${error}`);
        } else {
          try {
            // Caminho para salvar o arquivo
            const pathPdf = _path.default.join(__dirname, '..', '..', '..', 'temp'); // Nome do arquivo PDF


            const fileName = `bingao_da_quina_edicao_${bingo.edition}`;
            const browser = await _puppeteer.default.launch();
            const page = await browser.newPage();
            await page.setContent(html); // eslint-disable-next-line no-unused-vars

            const pdf = await page.pdf({
              printBackground: true,
              format: 'a4',
              landscape: false,
              path: `${pathPdf}/${fileName}.pdf`,
              margin: {
                top: '20px',
                bottom: '20px',
                left: '20px',
                right: '20px'
              }
            });
            await browser.close();
          } catch (err) {
            console.log(err);
            return response.render('quinary/register', {
              error: 'Algum erro aconteceu'
            });
          }
        }
      }); // Verifica se houve ganhador no bingo


      const winner = _verifyWinner.default.hasWinner(bettings, noDuplicates);

      if (winner.hasWinner > 0) {
        // Finaliza a edição do bingo caso haja ganhador
        await _Bingo.default.update(bingo.id, {
          end_date: _format.default.date(Date.now()).iso,
          status: 'FINALIZADO'
        });
        return response.redirect('/reports/haswinner');
      }

      return response.render('quinary/register', {
        bingoId: bingo.id,
        quinarys: quinarysList,
        success: 'Sorteio cadastrado com sucesso!'
      });
    } catch (err) {
      console.log(err);
      return response.render('quinary/register', {
        error: 'Algum erro aconteceu'
      });
    }
  },

  async edit(request, response) {
    try {
      let results = await _Quinary.default.find(request.params.id);
      const quinary = results.rows[0]; // Formata Phone para mostrar Phone com máscara

      quinary.contestdata = _format.default.date(quinary.contestdata).iso; // Retorna o ID do Bingo ativo no momento

      results = await _Bingo.default.findActive();
      const bingo = results.rows[0]; // Retorna a lista dos últimos sorteios

      results = await _Quinary.default.all(bingo.id);
      const quinarys = results.rows; // Altera os valores dos campos que precisam de formatação
      // eslint-disable-next-line no-shadow

      const quinarysPromise = quinarys.map(async quinary => {
        // eslint-disable-next-line no-param-reassign
        quinary.contestdata = _format.default.date(quinary.contestdata).ptbr;
        return quinary;
      });
      const quinarysList = await Promise.all(quinarysPromise);
      return response.render('quinary/edit', {
        quinary,
        quinarys: quinarysList
      });
    } catch (err) {
      return response.render('quinary/edit', {
        error: 'Algum erro aconteceu'
      });
    }
  },

  async update(request, response) {
    try {
      const quinary = request.body;
      const {
        contestdata,
        ten_first,
        ten_second,
        ten_third,
        ten_forth,
        ten_fifth
      } = request.body; // Atualiza os dados no banco de dados

      await _Quinary.default.update(quinary.id, {
        contestdata: _format.default.date(contestdata).iso,
        ten_first,
        ten_second,
        ten_third,
        ten_forth,
        ten_fifth
      }); // Retorna o ID do Bingo ativo no momento

      let results = await _Bingo.default.findActive();
      const bingo = results.rows[0]; // Retorna a lista dos últimos sorteios

      results = await _Quinary.default.all(bingo.id);
      const quinarys = results.rows; // Altera os valores dos campos que precisam de formatação
      // eslint-disable-next-line no-shadow

      const quinarysPromise = quinarys.map(async quinary => {
        // eslint-disable-next-line no-param-reassign
        quinary.contestdata = _format.default.date(quinary.contestdata).ptbr;
        return quinary;
      });
      const quinarysList = await Promise.all(quinarysPromise);
      return response.render('quinary/edit', {
        quinary,
        quinarys: quinarysList,
        success: 'Dados atualizados com sucesso!'
      });
    } catch (err) {
      return response.render('quinary/edit', {
        error: 'Algum erro aconteceu'
      });
    }
  },

  registrationBlocked(request, response) {
    return response.render('quinary/blocked');
  }

};
var _default = PunterController;
exports.default = _default;