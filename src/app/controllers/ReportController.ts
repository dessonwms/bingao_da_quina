import QuinaryModel from '../models/Quinary';
import BingoModel from '../models/Bingo';

import verifyWinner from '../../lib/verifyWinner';
import ReportModel from '../models/Report';

const ReportController = {
  async hasWinner(request: any, response: any) {
    try {
      // Retorna o ID do Bingo ativo no momento
      let results = await BingoModel.findActive();
      const bingo = results.rows[0];

      // Retorna a lista dos últimos sorteios
      results = await QuinaryModel.all(bingo.id);
      const quinarys = results.rows;
      // Concatena valores dos sorteios retirando as duplicatas
      const noDuplicates = verifyWinner.concatenateWithoutDuplicates(quinarys);

      // Retorna registros na tabela de winners passiveis de premiação
      results = await ReportModel.onlyWinners(bingo.id);
      const onlyWinners = results.rows;

      return response.render('report/has_winner.njk', {
        onlyWinners,
        noDuplicates,
      });
    } catch (err) {
      return response.render('report/has_winner.njk', {
        error: 'Algum erro aconteceu',
      });
    }
  },
};

export default ReportController;
