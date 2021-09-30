/* eslint-disable camelcase */
import nunjucks from 'nunjucks';
import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';

import QuinaryModel from '../models/Quinary';
import BetsModel from '../models/Bettings';
import BingoModel from '../models/Bingo';
import ReportModel from '../models/Report';

import globalInfo from '../../config/globalInfo';
import format from '../../lib/format';
import verifyWinner from '../../lib/verifyWinner';
import summaryValues from '../../lib/summaryValues';

import SaveWinnerInformationInTheWinnersTableService from '../services/SaveWinnerInformationInTheWinnersTableService';

const PunterController = {
  async registerForm(request: any, response: any) {
    try {
      // Retorna o ID do Bingo ativo no momento
      let results = await BingoModel.findActive();
      const bingo = results.rows[0];

      // Retorna a lista dos últimos sorteios
      results = await QuinaryModel.all(bingo.id);
      const quinarys = results.rows;
      const numRows = results.rowCount;

      // Altera os valores dos campos que precisam de formatação
      // eslint-disable-next-line no-shadow
      const quinarysPromise = quinarys.map(async quinary => {
        // eslint-disable-next-line no-param-reassign
        quinary.contestdata = format.date(quinary.contestdata).birthDay;
        return quinary;
      });
      const quinarysList = await Promise.all(quinarysPromise);

      return response.render('quinary/register', {
        quinarys: quinarysList,
        numRows,
        bingoId: bingo.id,
      });
    } catch (err) {
      return response.render('quinary/register', {
        error: 'Algum erro aconteceu',
      });
    }
  },
  async post(request: any, response: any) {
    try {
      // Salva no banco de dados
      await QuinaryModel.create(request.body);

      // Retorna o ID do Bingo ativo no momento
      let results = await BingoModel.findActive();
      const bingo = results.rows[0];

      // Retorna a lista dos últimos sorteios
      results = await QuinaryModel.all(bingo.id);
      const quinarys = results.rows;
      // Altera os valores dos campos que precisam de formatação
      // eslint-disable-next-line no-shadow
      const quinarysPromise = quinarys.map(async quinary => {
        // eslint-disable-next-line no-param-reassign
        quinary.contestdata = format.date(quinary.contestdata).ptbr;
        return quinary;
      });
      const quinarysList = await Promise.all(quinarysPromise);
      // Concatena valores dos sorteios retirando as duplicatas
      const noDuplicates = verifyWinner.concatenateWithoutDuplicates(quinarys);

      // Retorna lista de apostas
      results = await BetsModel.all(bingo.id);
      const bettings = results.rows;

      // SALVA INFORMAÇÕES DE GANHADORES NA TABELA DE WINNERS
      await SaveWinnerInformationInTheWinnersTableService.execute(
        bettings,
        noDuplicates,
        bingo.id,
      );

      // GERA E FORMATA DADOS PARA EXIBIÇÃO NO PDF
      // Retorna lista com todas as 80 dezenas da Quina
      results = await QuinaryModel.allTen();
      const quinaryTens = results.rows;
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
            ratings[0]?.minimo,
            summaryValues.minorHitAward(
              summaryValues.grandTotal(totalBets.count),
            ),
          ),
        ),
      };

      // Retorna lista de todas as apostas referentes a edição atual do Bingo
      results = await BetsModel.summaryPdf(bingo.id);
      const bettingsPdf = results.rows;

      // TRATA DADOS PARA EXIBIÇÃO NA TABELA DE RANKING
      const dataSummary = await summaryValues.generateRankingData(ratings);

      // GERA PDF
      nunjucks.render(
        'bingo/summary_pdf/index.njk',
        {
          totalRatings: dataSummary.length,
          ratings,
          summary,
          bingo,
          quinarys,
          quinaryTens,
          noDuplicates,
          globalInfo,
          dataSummary,
          bettings: bettingsPdf,
        },
        // eslint-disable-next-line consistent-return
        async (error: any, html: any) => {
          if (error) {
            console.log(`Erro: ${error}`);
          } else {
            try {
              // Caminho para salvar o arquivo
              const pathPdf = path.join(__dirname, '..', '..', '..', 'temp');
              // Nome do arquivo PDF
              const fileName = `bingao_da_quina_edicao_${bingo.edition}`;

              // DELETA O PDF ANTES DE SALVAR UM NOVO
              fs.unlinkSync(`${pathPdf}/${fileName}.pdf`);

              const browser = await puppeteer.launch();
              const page = await browser.newPage();

              await page.setContent(html);

              // eslint-disable-next-line no-unused-vars
              const pdf = await page.pdf({
                printBackground: true,
                format: 'a4',
                landscape: false,
                path: `${pathPdf}/${fileName}.pdf`,
                margin: {
                  top: '20px',
                  bottom: '20px',
                  left: '20px',
                  right: '20px',
                },
              });

              await browser.close();
            } catch (err) {
              console.log(err);
              return response.render('quinary/register', {
                error: 'Algum erro aconteceu',
              });
            }
          }
        },
      );

      // Verifica se houve ganhador no bingo
      const winner = verifyWinner.hasWinner(bettings, noDuplicates);
      if (winner.hasWinner > 0) {
        // Finaliza a edição do bingo caso haja ganhador
        await BingoModel.update(bingo.id, {
          end_date: format.date(Date.now()).iso,
          status: 'FINALIZADO',
        });
        return response.redirect('/reports/haswinner');
      }

      return response.render('quinary/register', {
        bingoId: bingo.id,
        quinarys: quinarysList,
        success: 'Sorteio cadastrado com sucesso!',
      });
    } catch (err) {
      console.log(err);
      return response.render('quinary/register', {
        error: 'Algum erro aconteceu',
      });
    }
  },
  async edit(request: any, response: any) {
    try {
      let results = await QuinaryModel.find(request.params.id);
      const quinary = results.rows[0];

      // Formata Phone para mostrar Phone com máscara
      quinary.contestdata = format.date(quinary.contestdata).iso;

      // Retorna o ID do Bingo ativo no momento
      results = await BingoModel.findActive();
      const bingo = results.rows[0];
      // Retorna a lista dos últimos sorteios
      results = await QuinaryModel.all(bingo.id);
      const quinarys = results.rows;
      // Altera os valores dos campos que precisam de formatação
      // eslint-disable-next-line no-shadow
      const quinarysPromise = quinarys.map(async quinary => {
        // eslint-disable-next-line no-param-reassign
        quinary.contestdata = format.date(quinary.contestdata).ptbr;
        return quinary;
      });
      const quinarysList = await Promise.all(quinarysPromise);

      return response.render('quinary/edit', {
        quinary,
        quinarys: quinarysList,
      });
    } catch (err) {
      return response.render('quinary/edit', {
        error: 'Algum erro aconteceu',
      });
    }
  },
  async update(request: any, response: any) {
    try {
      const quinary = request.body;

      const {
        contestdata,
        ten_first,
        ten_second,
        ten_third,
        ten_forth,
        ten_fifth,
      } = request.body;

      // Atualiza os dados no banco de dados
      await QuinaryModel.update(quinary.id, {
        contestdata: format.date(contestdata).iso,
        ten_first,
        ten_second,
        ten_third,
        ten_forth,
        ten_fifth,
      });

      // Retorna o ID do Bingo ativo no momento
      let results = await BingoModel.findActive();
      const bingo = results.rows[0];

      // Retorna a lista dos últimos sorteios
      results = await QuinaryModel.all(bingo.id);
      const quinarys = results.rows;
      // Altera os valores dos campos que precisam de formatação
      // eslint-disable-next-line no-shadow
      const quinarysPromise = quinarys.map(async quinary => {
        // eslint-disable-next-line no-param-reassign
        quinary.contestdata = format.date(quinary.contestdata).ptbr;
        return quinary;
      });
      const quinarysList = await Promise.all(quinarysPromise);
      // Concatena valores dos sorteios retirando as duplicatas
      const noDuplicates = verifyWinner.concatenateWithoutDuplicates(quinarys);

      // Retorna lista de apostas
      results = await BetsModel.all(bingo.id);
      const bettings = results.rows;

      // SALVA INFORMAÇÕES DE GANHADORES NA TABELA DE WINNERS
      await SaveWinnerInformationInTheWinnersTableService.execute(
        bettings,
        noDuplicates,
        bingo.id,
      );

      // GERA E FORMATA DADOS PARA EXIBIÇÃO NO PDF
      // Retorna lista com todas as 80 dezenas da Quina
      results = await QuinaryModel.allTen();
      const quinaryTens = results.rows;

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
            ratings[0]?.minimo,
            summaryValues.minorHitAward(
              summaryValues.grandTotal(totalBets.count),
            ),
          ),
        ),
      };

      // Retorna lista de todas as apostas referentes a edição atual do Bingo
      results = await BetsModel.summaryPdf(bingo.id);
      const bettingsPdf = results.rows;

      // TRATA DADOS PARA EXIBIÇÃO NA TABELA DE RANKING
      const dataSummary = await summaryValues.generateRankingData(ratings);

      // GERA PDF
      nunjucks.render(
        'bingo/summary_pdf/index.njk',
        {
          totalRatings: dataSummary.length,
          ratings,
          summary,
          bingo,
          quinarys,
          quinaryTens,
          noDuplicates,
          globalInfo,
          dataSummary,
          bettings: bettingsPdf,
        },
        // eslint-disable-next-line consistent-return
        async (error: any, html: any) => {
          if (error) {
            console.log(`Erro: ${error}`);
          } else {
            try {
              // Caminho para salvar o arquivo
              const pathPdf = path.join(__dirname, '..', '..', '..', 'temp');
              // Nome do arquivo PDF
              const fileName = `bingao_da_quina_edicao_${bingo.edition}`;

              // DELETA O PDF ANTES DE SALVAR UM NOVO
              fs.unlinkSync(`${pathPdf}/${fileName}.pdf`);

              const browser = await puppeteer.launch();
              const page = await browser.newPage();

              await page.setContent(html);

              // eslint-disable-next-line no-unused-vars
              const pdf = await page.pdf({
                printBackground: true,
                format: 'a4',
                landscape: false,
                path: `${pathPdf}/${fileName}.pdf`,
                margin: {
                  top: '20px',
                  bottom: '20px',
                  left: '20px',
                  right: '20px',
                },
              });

              await browser.close();
            } catch (err) {
              console.log(err);
              return response.render('quinary/register', {
                error: 'Algum erro aconteceu',
              });
            }
          }
        },
      );

      // Verifica se houve ganhador no bingo
      const winner = verifyWinner.hasWinner(bettings, noDuplicates);
      if (winner.hasWinner > 0) {
        // Finaliza a edição do bingo caso haja ganhador
        await BingoModel.update(bingo.id, {
          end_date: format.date(Date.now()).iso,
          status: 'FINALIZADO',
        });
        return response.redirect('/reports/haswinner');
      }

      return response.render('quinary/edit', {
        quinary,
        quinarys: quinarysList,
        success: 'Dados atualizados com sucesso!',
      });
    } catch (err) {
      return response.render('quinary/edit', {
        error: 'Algum erro aconteceu',
      });
    }
  },
  registrationBlocked(request: any, response: any) {
    return response.render('quinary/blocked');
  },
};

export default PunterController;
