// import path from 'path';

import puppeteer from 'puppeteer';
// import nunjucks from 'nunjucks';
import BingoModel from '../models/Bingo';
import QuinaryModel from '../models/Quinary';
import BetsModel from '../models/Bettings';
import ReportModel from '../models/Report';

import globalInfo from '../../config/globalInfo';
import format from '../../lib/format';
import verifyWinner from '../../lib/verifyWinner';
import summaryValues from '../../lib/summaryValues';

const HomeController = {
  async registerForm(request: any, response: any) {
    try {
      // Cria data atual para popular o campo date no formulário
      const date = format.date(Date.now()).iso;

      // Seleciona o último registro de Bingo
      const bingo = await BingoModel.selectLast({
        fields: '*',
        table: 'bingos',
        orderField: 'id',
        order: 'DESC',
        limit: 1,
      });

      if (!bingo.start_date) {
        bingo.start_date = date;
      } else {
        bingo.start_date = format.date(bingo.start_date).iso;
      }

      if (bingo.end_date) {
        bingo.end_date = format.date(bingo.end_date).iso;
      }

      // Retorna lista de Bingos
      let results = await BingoModel.all();
      let bingoList = results.rows;

      const usersPromise = bingoList.map(async bingos => {
        // eslint-disable-next-line no-param-reassign
        bingos.start_date = format.date(bingos.start_date).ptbr;

        if (bingos.end_date !== null) {
          // eslint-disable-next-line no-param-reassign
          bingos.end_date = format.date(bingos.end_date).ptbr;
        }

        return bingos;
      });
      bingoList = await Promise.all(usersPromise);

      // Retorna os dados de ranking de acertos
      results = await ReportModel.rankingHome(bingo.id);
      const ratings = results.rows;

      return response.render('bingo/index', {
        bingo,
        ratings,
        bingoList,
      });
    } catch (err) {
      console.error(err);
      return response.render('bingo/index', {
        error: 'Algum erro aconteceu',
      });
    }
  },
  async post(request: any, response: any) {
    try {
      // Cria data atual para popular o campo date no formulário
      request.body.start_date = format.date(Date.now()).iso;

      // Gerencia número da edição (verificando se é a primeira edição cadastrada)
      // const { firstRegister } = request.body.first_register;
      if (!request.body.first_register) {
        request.body.edition = parseInt(request.body.edition, 10) + 1;
      }
      // Salva no banco de dados
      await BingoModel.create(request.body, request.session.userId);

      // Seleciona o último registro de Bingo
      const bingo = await BingoModel.selectLast({
        fields: '*',
        table: 'bingos',
        orderField: 'id',
        order: 'DESC',
        limit: 1,
      });

      bingo.start_date = format.date(bingo.start_date).iso;

      // Retorna lista de administradores
      const results = await BingoModel.all();
      let bingoList = results.rows;

      const usersPromise = bingoList.map(async bingos => {
        // eslint-disable-next-line no-param-reassign
        bingos.start_date = format.date(bingos.start_date).ptbr;

        if (bingos.end_date !== null) {
          // eslint-disable-next-line no-param-reassign
          bingos.end_date = format.date(bingos.end_date).ptbr;
        }

        return bingos;
      });
      bingoList = await Promise.all(usersPromise);

      return response.render('bingo/index', {
        bingo,
        bingoList,
        success: 'Bingo cadastrado com sucesso!',
      });
    } catch (err) {
      console.error(err);
      return response.render('bingo/index', {
        error: 'Algum erro aconteceu',
      });
    }
  },
  async update(request: any, response: any) {
    try {
      const bingo = request.body;

      // eslint-disable-next-line camelcase
      const { edition, status, released_bets } = request.body;

      await BingoModel.update(bingo.id, {
        edition,
        status,
        released_bets,
        user_id: request.session.userId,
      });

      bingo.start_date = format.date(bingo.start_date).iso;

      // Retorna lista de administradores
      const results = await BingoModel.all();
      let bingoList = results.rows;

      const usersPromise = bingoList.map(async bingos => {
        // eslint-disable-next-line no-param-reassign
        bingos.start_date = format.date(bingos.start_date).ptbr;
        // eslint-disable-next-line no-param-reassign

        if (bingos.end_date !== null) {
          // eslint-disable-next-line no-param-reassign
          bingos.end_date = format.date(bingos.end_date).ptbr;
        }

        return bingos;
      });
      bingoList = await Promise.all(usersPromise);

      return response.render('bingo/index', {
        bingo,
        bingoList,
        success: 'Dados atualizados com sucesso!',
      });
    } catch (err) {
      console.error(err);
      return response.render('bingo/index', {
        error: 'Algum erro aconteceu',
      });
    }
  },
  async showList(request: any, response: any) {
    // Retorna lista de Bingos
    const results = await BingoModel.all();
    let bingoList = results.rows;

    const usersPromise = bingoList.map(async bingos => {
      // eslint-disable-next-line no-param-reassign
      bingos.start_date = format.date(bingos.start_date).ptbr;

      if (bingos.end_date !== null) {
        // eslint-disable-next-line no-param-reassign
        bingos.end_date = format.date(bingos.end_date).ptbr;
      }

      return bingos;
    });
    bingoList = await Promise.all(usersPromise);

    return response.render('bingo/edition_list', {
      bingoList,
    });
  },
  async summary(request: any, response: any) {
    try {
      // Busca os dados do bingo
      let results = await BingoModel.find(request.params.id);
      const bingo = results.rows[0];

      // Retorna a lista dos últimos sorteios da quina
      results = await QuinaryModel.all(bingo.id);
      let quinarys = results.rows;

      // Retorna lista com todas as 80 dezenas da Quina
      results = await QuinaryModel.allTen();
      const quinaryTens = results.rows;
      // Concatena valores dos sorteios retirando as duplicatas
      const noDuplicates = verifyWinner.concatenateWithoutDuplicates(quinarys);
      // Altera os valores dos campos que precisam de formatação
      // eslint-disable-next-line no-shadow
      const quinarysPromise = quinarys.map(async quinary => {
        // eslint-disable-next-line no-param-reassign
        quinary.contestdata = format.date(quinary.contestdata).ptbr;
        return quinary;
      });
      quinarys = await Promise.all(quinarysPromise);

      // Retorna o total de apostas registradas no sistema
      const totalBets = await ReportModel.totalRegister({
        table: 'bettings',
        bingoId: bingo.id,
        limit: 1,
      });

      // Retorna os dados de ranking de acertos
      results = await ReportModel.rankingHome(bingo.id);
      const ratings = results.rows;
      // Cálculos de resumo do bingo
      const summary = {
        totalBets: totalBets.count,
        valueBets: format.formatPrice(summaryValues.valueBet),
        grandTotal: format.formatPrice(
          summaryValues.grandTotal(totalBets.count),
        ),
        administrationFee: format.formatPrice(
          summaryValues.administrationFee(
            summaryValues.grandTotal(totalBets.count),
          ),
        ),
        firstPlaceAward: format.formatPrice(
          summaryValues.firstPlaceAward(
            summaryValues.grandTotal(totalBets.count),
          ),
        ),
        secondPlaceAward: format.formatPrice(
          summaryValues.secondPlaceAward(
            summaryValues.grandTotal(totalBets.count),
          ),
        ),
        minorHitAward: format.formatPrice(
          summaryValues.minorHitAward(
            summaryValues.grandTotal(totalBets.count),
          ),
        ),
        prizeForTenHits: format.formatPrice(
          summaryValues.prizePerWinner(
            ratings,
            10,
            summaryValues.firstPlaceAward(
              summaryValues.grandTotal(totalBets.count),
            ),
          ),
        ),
        prizeForNineHits: format.formatPrice(
          summaryValues.prizePerWinner(
            ratings,
            9,
            summaryValues.secondPlaceAward(
              summaryValues.grandTotal(totalBets.count),
            ),
          ),
        ),
        prizeMinorHit: format.formatPrice(
          summaryValues.prizePerWinner(
            ratings,
            ratings[0].minimo,
            summaryValues.minorHitAward(
              summaryValues.grandTotal(totalBets.count),
            ),
          ),
        ),
      };

      // TRATA DADOS PARA EXIBIÇÃO NA TABELA DE RANKING
      const dataSummary = summaryValues.generateRankingData(ratings);

      // PAGINAÇÃO DE APOSTAS
      let { page } = request.query;

      page = page || 1;
      const limit = 10;
      const offset = limit * (page - 1);

      const params = {
        bingoId: bingo.id,
        page,
        limit,
        offset,
        async callback(bettings: any) {
          let total;

          if (bettings.count !== 0) {
            total = bettings[0]?.total;
          } else {
            total = 0;
          }

          const pagination = { total: Math.ceil(total / limit), page };

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
            total,
          });
        },
      };
      return BetsModel.paginate(params);
    } catch (err) {
      console.error(err);
      return response.render('bingo/index', {
        error: 'Algum erro aconteceu',
      });
    }
  },
  async summaryPdf(request: any, response: any) {
    try {
      // Busca os dados do bingo
      let results = await BingoModel.find(request.params.id);
      const bingo = results.rows[0];

      // Retorna a lista dos últimos sorteios da quina
      results = await QuinaryModel.all(bingo.id);
      let quinarys = results.rows;
      // Retorna lista com todas as 80 dezenas da Quina
      results = await QuinaryModel.allTen();
      const quinaryTens = results.rows;
      // Concatena valores dos sorteios retirando as duplicatas
      const noDuplicates = verifyWinner.concatenateWithoutDuplicates(quinarys);
      // Altera os valores dos campos que precisam de formatação
      // eslint-disable-next-line no-shadow
      const quinarysPromise = quinarys.map(async quinary => {
        // eslint-disable-next-line no-param-reassign
        quinary.contestdata = format.date(quinary.contestdata).ptbr;
        return quinary;
      });
      quinarys = await Promise.all(quinarysPromise);

      // Retorna lista de todas as apostas referentes a edição atual do Bingo
      results = await BetsModel.summaryPdf(bingo.id);
      const bettings = results.rows;

      // Retorna o total de apostas registradas no sistema
      const totalBets = await ReportModel.totalRegister({
        table: 'bettings',
        bingoId: bingo.id,
        limit: 1,
      });

      // Retorna os dados de ranking de acertos
      results = await ReportModel.rankingHome(bingo.id);
      const ratings = results.rows;
      // Cálculos de resumo do bingo
      const summary = {
        totalBets: totalBets.count,
        valueBets: format.formatPrice(summaryValues.valueBet),
        grandTotal: format.formatPrice(
          summaryValues.grandTotal(totalBets.count),
        ),
        administrationFee: format.formatPrice(
          summaryValues.administrationFee(
            summaryValues.grandTotal(totalBets.count),
          ),
        ),
        firstPlaceAward: format.formatPrice(
          summaryValues.firstPlaceAward(
            summaryValues.grandTotal(totalBets.count),
          ),
        ),
        secondPlaceAward: format.formatPrice(
          summaryValues.secondPlaceAward(
            summaryValues.grandTotal(totalBets.count),
          ),
        ),
        minorHitAward: format.formatPrice(
          summaryValues.minorHitAward(
            summaryValues.grandTotal(totalBets.count),
          ),
        ),
        prizeTotal: format.formatPrice(
          summaryValues.prizeTotal(summaryValues.grandTotal(totalBets.count)),
        ),
        prizeForTenHits: format.formatPrice(
          summaryValues.prizePerWinner(
            ratings,
            10,
            summaryValues.firstPlaceAward(
              summaryValues.grandTotal(totalBets.count),
            ),
          ),
        ),
        prizeForNineHits: format.formatPrice(
          summaryValues.prizePerWinner(
            ratings,
            9,
            summaryValues.secondPlaceAward(
              summaryValues.grandTotal(totalBets.count),
            ),
          ),
        ),
        prizeMinorHit: format.formatPrice(
          summaryValues.prizePerWinner(
            ratings,
            ratings[0].minimo,
            summaryValues.minorHitAward(
              summaryValues.grandTotal(totalBets.count),
            ),
          ),
        ),
      };

      // TRATA DADOS PARA EXIBIÇÃO NA TABELA DE RANKING
      const dataSummary = summaryValues.generateRankingData(ratings);

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
        globalInfo,
      });
    } catch (err) {
      console.error(err);
      return response.render('bingo/summary_pdf/index', {
        error: 'Algum erro aconteceu',
      });
    }
  },
  async downloadPdf(request: any, response: any) {
    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();

      await page.goto('https://bingaodaquina.com.br/bingos/1/summary_pdf');

      // // eslint-disable-next-line no-unused-vars
      const pdf = await page.pdf({
        printBackground: true,
        format: 'a4',
        landscape: false,
        margin: {
          top: '20px',
          bottom: '20px',
          left: '20px',
          right: '20px',
        },
      });

      await browser.close();

      response.contentType('application/pdf');

      return response.send(pdf);
    } catch (err) {
      console.log(err);
      return response.render('quinary/register', {
        error: 'Algum erro aconteceu',
      });
    }
  },
};

export default HomeController;
