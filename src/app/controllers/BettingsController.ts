import BingoModel from '../models/Bingo';
import BetsModel from '../models/Bettings';
import PunterModel from '../models/Punter';
import QuinaryModel from '../models/Quinary';
import ReportModel from '../models/Report';

import globalInfo from '../../config/globalInfo';
import format from '../../lib/format';
import selectQuota from '../../lib/selectQuota';
import verifyWinner from '../../lib/verifyWinner';
import summaryValues from '../../lib/summaryValues';

const BetsController = {
  async selectPunter(request: any, response: any) {
    try {
      const { searchName, searchPhone, selectFieldSearch } = request.query;

      // Responsável por verificar qual o tipo da pesquisa
      let filter = '';

      if (selectFieldSearch === 'name') {
        filter = searchName;
      } else if (selectFieldSearch === 'phone') {
        filter = searchPhone.replace(/\D/g, '');
      }

      // PAGINAÇÃO
      let { page, limit } = request.query;

      page = page || 1;
      limit = limit || 10;
      const offset = limit * (page - 1);

      const params = {
        selectFieldSearch,
        filter,
        page,
        limit,
        offset,
        async callback(punters: any) {
          let total;

          if (punters.count !== 0) {
            total = punters[0]?.total;
          } else {
            total = 0;
          }

          // Formata o campo de telefone para exibir na tabela
          const punterPromise = punters.map((punterList: { phone: any }) => {
            // eslint-disable-next-line no-param-reassign
            punterList.phone = format.phone(punterList.phone);
            return punterList;
          });
          const punterList = await Promise.all(punterPromise);

          const pagination = {
            total: Math.ceil(total / limit),
            page,
          };
          return response.render('betting/index', {
            punter: request.body,
            pagination,
            filter,
            searchName,
            searchPhone,
            total,
            punters: punterList,
            name: searchName,
            phone: searchPhone,
            selectFieldSearch,
          });
        },
      };

      return PunterModel.paginate(params);
    } catch (err) {
      return response.render('betting/index', {
        error: 'Algum erro aconteceu',
      });
    }
  },
  async registerForm(request: any, response: any) {
    try {
      const userId = request.params.id;

      // Retorna o ID do Bingo ativo no momento
      let results = await BingoModel.findActive();
      const bingo = results.rows[0];

      // Busca os dados do usuário
      results = await PunterModel.find(request.params.id);
      const punter = results.rows[0];
      // Adiciona mascará de phone
      punter.phone = format.phone(punter.phone);

      // Retorna lista de cotas do apostador
      results = await BetsModel.searchBetsByBettor(bingo.id, punter.id);
      let bets = results.rows;
      const numBets = results.rowCount;

      const usersPromise = bets.map(async bet => {
        // eslint-disable-next-line no-param-reassign
        bet.created_at = format.date(bet.created_at).extensive;
        return bet;
      });
      bets = await Promise.all(usersPromise);

      // Verifica se já existe cotas cadastradas e gera erray para select de cotas
      const selectQuotas = selectQuota.filter(bets);

      return response.render(`betting/register`, {
        userId,
        bingoId: bingo.id,
        punter,
        bets,
        numBets,
        selectQuotas,
      });
    } catch (err) {
      return response.render('betting/register', {
        error: 'Algum erro aconteceu',
      });
    }
  },
  async post(request: any, response: any) {
    try {
      const { userId, number } = request.body;

      // Retorna o ID do Bingo ativo no momento
      let results = await BingoModel.findActive();
      const bingo = results.rows[0];

      // Salva no banco de dados
      await BetsModel.create(request.body, request.session.userId);

      // Busca os dados do usuário
      results = await PunterModel.find(request.params.id);
      const punter = results.rows[0];
      // Adiciona mascará de phone
      punter.phone = format.phone(punter.phone);

      // Retorna lista de cotas do apostador
      results = await BetsModel.searchBetsByBettor(bingo.id, punter.id);
      let bets = results.rows;
      const numBets = results.rowCount;

      const usersPromise = bets.map(async bet => {
        // eslint-disable-next-line no-param-reassign
        bet.created_at = format.date(bet.created_at).extensive;
        return bet;
      });
      bets = await Promise.all(usersPromise);

      return response.render(`betting/receipt`, {
        bingoId: bingo.id,
        userId,
        numbers: number,
        punter,
        bets,
        numBets,
        success: 'Aposta cadastrada com sucesso!',
      });
    } catch (err) {
      return response.render('betting/receipt', {
        error: 'Algum erro aconteceu',
      });
    }
  },
  async edit(request: any, response: any) {
    try {
      const bettingId = request.params.id;

      // Retorna o ID do Bingo ativo no momento
      let results = await BingoModel.findActive();
      const bingo = results.rows[0];

      // Busca os dados do usuário e números da aposta
      results = await BetsModel.findPunter(bettingId);
      const betPunter = results.rows[0];

      // Adiciona mascará de phone
      betPunter.phone = format.phone(betPunter.phone);

      // Retorna lista de cotas do apostador
      results = await BetsModel.searchBetsByBettor(bingo.id, betPunter.user_id);
      let bets = results.rows;
      const numBets = results.rowCount;

      const usersPromise = bets.map(async bet => {
        // eslint-disable-next-line no-param-reassign
        bet.created_at = format.date(bet.created_at).extensive;
        return bet;
      });
      bets = await Promise.all(usersPromise);

      // Verifica se já existe cotas cadastradas e gera erray para select de cotas
      const selectQuotas = selectQuota.filterUpdate(bets, betPunter.quota);

      return response.render(`betting/edit`, {
        bingoId: bingo.id,
        betPunter,
        bets,
        numBets,
        selectQuotas,
      });
    } catch (err) {
      return response.render('betting/edit', {
        error: 'Algum erro aconteceu',
      });
    }
  },
  async update(request: any, response: any) {
    try {
      const bettingId = request.params.id;

      // eslint-disable-next-line camelcase
      const data = request.body;

      // Atualiza os dados no banco de dados
      await BetsModel.update(bettingId, {
        first_ten: data.number[0],
        second_ten: data.number[1],
        third_ten: data.number[2],
        forth_ten: data.number[3],
        fifth_ten: data.number[4],
        sixth_ten: data.number[5],
        seventh_ten: data.number[6],
        eighth_ten: data.number[7],
        ninth_ten: data.number[8],
        tenth_ten: data.number[9],
        payment_status: data.payment_status,
        quota: data.quota,
      });

      // Retorna o ID do Bingo ativo no momento
      let results = await BingoModel.findActive();
      const bingo = results.rows[0];

      // Busca os dados do usuário e números da aposta
      results = await BetsModel.findPunter(bettingId);
      const betPunter = results.rows[0];

      // Adiciona mascará de phone
      betPunter.phone = format.phone(betPunter.phone);

      // Retorna lista de cotas do apostador
      results = await BetsModel.searchBetsByBettor(bingo.id, betPunter.user_id);
      let bets = results.rows;
      const numBets = results.rowCount;

      const usersPromise = bets.map(async bet => {
        // eslint-disable-next-line no-param-reassign
        bet.created_at = format.date(bet.created_at).extensive;
        return bet;
      });
      bets = await Promise.all(usersPromise);

      // Verifica se já existe cotas cadastradas e gera erray para select de cotas
      const selectQuotas = selectQuota.filterUpdate(bets, betPunter.quota);

      return response.render(`betting/edit`, {
        bingoId: bingo.id,
        betPunter,
        bets,
        numBets,
        selectQuotas,
      });
    } catch (err) {
      return response.render('betting/edit', {
        error: 'Algum erro aconteceu',
      });
    }
  },
  registrationBlocked(request: any, response: any) {
    return response.render('betting/blocked');
  },
  async summary(request: any, response: any) {
    try {
      // Seleciona o último registro de Bingo
      const bingo = await BingoModel.selectLast({
        fields: '*',
        table: 'bingos',
        orderField: 'id',
        order: 'DESC',
        limit: 1,
      });

      // Retorna a lista dos últimos sorteios da quina
      let results = await QuinaryModel.all(bingo.id);
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

      // PAGINAÇÃO DE APOSTAS
      let { page } = request.query;

      page = page || 1;
      const limit = 25;
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

          return response.render('betting/list_all', {
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
            globalInfo,
          });
        },
      };
      return BetsModel.paginate(params);
    } catch (err) {
      console.log(err);
      return response.render('betting/list_all', {
        error: 'Algum erro aconteceu',
      });
    }
  },
  async delete(request: any, response: any) {
    try {
      const { id, punter } = request.params;

      await BetsModel.delete(id);

      return response.redirect(`/punters/${punter}/view_bets`);
    } catch (err) {
      return response.render('betting/edit', {
        error: 'Algum erro aconteceu',
      });
    }
  },
};

export default BetsController;
