/* eslint-disable camelcase */
import QuinaryModel from '../models/Quinary';
import BetsModel from '../models/Bettings';
import BingoModel from '../models/Bingo';
import format from '../../lib/format';
import verifyWinner from '../../lib/verifyWinner';

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
