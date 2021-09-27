import BingoModel from '../models/Bingo';
import QuinaryModel from '../models/Quinary';
import ReportModel from '../models/Report';

import format from '../../lib/format';
import summaryValues from '../../lib/summaryValues';

const HomeController = {
  async index(request: any, response: any) {
    try {
      // Seleciona o último registro de Bingo
      const bingo = await BingoModel.selectLast({
        fields: '*',
        table: 'bingos',
        orderField: 'id',
        order: 'DESC',
        limit: 1,
      });
      bingo.start_date = format.date(bingo.start_date).ptbr;
      if (bingo.end_date) {
        bingo.end_date = format.date(bingo.end_date).ptbr;
      }

      // Retorna a lista dos últimos sorteios da quina
      let results = await QuinaryModel.all(bingo.id);
      const quinarys = results.rows;
      const quinarysNumRows = results.rowCount;
      // Altera os valores dos campos que precisam de formatação
      // eslint-disable-next-line no-shadow
      const quinarysPromise = quinarys.map(async quinary => {
        // eslint-disable-next-line no-param-reassign
        quinary.contestdata = format.date(quinary.contestdata).ptbr;
        return quinary;
      });
      const quinarysList = await Promise.all(quinarysPromise);

      // Retorna o total de apostas registradas no sistema
      const totalBets = await ReportModel.totalRegister({
        table: 'bettings',
        bingoId: bingo.id,
        limit: 1,
      });

      // Retorna os dados de ranking de acertos
      results = await ReportModel.rankingHome(bingo.id);
      const ratings = results.rows;

      let summary = {};
      let dataSummary;

      if (ratings) {
        // Cálculos de resumo do bingo
        summary = {
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
              ratings[0]?.minimo,
              summaryValues.minorHitAward(
                summaryValues.grandTotal(totalBets.count),
              ),
            ),
          ),
        };
        // TRATA DADOS PARA EXIBIÇÃO NA TABELA DE RANKING
        dataSummary = summaryValues.generateRankingData(ratings);
      }

      return response.render('home/index.njk', {
        bingo,
        dataSummary,
        totalRatings: dataSummary.length,
        ratings,
        summary,
        quinarys: quinarysList,
        quinarysNumRows,
      });
    } catch (err) {
      console.log(err);
      return response.render('quinary/edit', {
        error: 'Algum erro aconteceu',
      });
    }
  },
};

export default HomeController;
