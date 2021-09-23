import BingoModel from '../models/Bingo';

const BettingValidator = {
  // eslint-disable-next-line consistent-return
  registrationBlocked: async (request: any, response: any, next: any) => {
    try {
      // Retorna lista de Bingos
      const results = await BingoModel.all();
      const numRows = results.rowCount;

      // Verifica se não há nenhum bingo cadastrado no sistema
      if (numRows === 0) {
        return response.render('betting/blocked', {
          message:
            'No momento ainda não há bingo cadastrado no sistema! Aguarde até a liberação do próximo Bingo.',
        });
      }

      // Seleciona o último registro de Bingo
      const bingo = await BingoModel.selectLast({
        fields: '*',
        table: 'bingos',
        orderField: 'id',
        order: 'DESC',
        limit: 1,
      });

      if (bingo.status === 'FINALIZADO') {
        return response.render('betting/blocked', {
          message:
            'No momento não é possível cadastrar novas apostas! Aguarde até a liberação do próximo Bingão.',
        });
      }

      if (bingo.released_bets === 'B') {
        return response.render('betting/blocked', {
          message: 'No momento o cadastro de novas apostas está bloqueado.',
        });
      }

      if (bingo.released_bets === 'C') {
        return response.render('betting/blocked', {
          message:
            'O período de cadastro de apostas na atual edição do bingão já foi finalizada.',
        });
      }

      next();
    } catch (err) {
      return response.render('betting/blocked', {
        error: 'Algum erro aconteceu',
      });
    }
  },
};

export default BettingValidator;
