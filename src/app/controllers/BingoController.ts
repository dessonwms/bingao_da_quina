import BingoModel from '../models/Bingo';

import format from '../../lib/utils';

const HomeController = {
  async registerForm(request: any, response: any) {
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

    // Retorna lista de administradores
    const results = await BingoModel.all();
    let bingoList = results.rows;

    const usersPromise = bingoList.map(async bingos => {
      // eslint-disable-next-line no-param-reassign
      bingos.start_date = format.date(bingos.start_date).ptbr;
      // eslint-disable-next-line no-param-reassign
      bingos.end_date = format.date(bingos.end_date).ptbr;
      return bingos;
    });
    bingoList = await Promise.all(usersPromise);

    return response.render('bingo/index', {
      bingo,
      bingoList,
    });
  },
  async update(request: any, response: any) {
    try {
      const bingo = request.body;

      // eslint-disable-next-line camelcase
      const { edition, start_date, status, released_bets } = request.body;

      await BingoModel.update(bingo.id, {
        edition,
        start_date: format.date(start_date).iso,
        status,
        released_bets,
        user_id: request.session.userId,
      });

      // Retorna lista de administradores
      const results = await BingoModel.all();
      let bingoList = results.rows;

      const usersPromise = bingoList.map(async bingos => {
        // eslint-disable-next-line no-param-reassign
        bingos.start_date = format.date(bingos.start_date).ptbr;
        // eslint-disable-next-line no-param-reassign
        bingos.end_date = format.date(bingos.end_date).ptbr;
        return bingos;
      });
      bingoList = await Promise.all(usersPromise);

      return response.render('bingo/index', {
        bingo,
        bingoList,
        success: 'Dados atualizados com sucesso!',
      });
    } catch (err) {
      return response.render('bingo/index', {
        error: 'Algum erro aconteceu',
      });
    }
  },
};

export default HomeController;
