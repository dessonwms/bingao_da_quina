import verifyWinner from '../../lib/verifyWinner';
import ReportModel from '../models/Report';

const SaveWinnerInformationInTheWinnersTableService = {
  async execute(bettings: any, noDuplicates: any, bingoId: any) {
    // Verifica se há dados de ganhadores na tabela de Winners
    const hasData = await ReportModel.checkForRecords(bingoId);

    if (hasData.rowCount === 0) {
      const resultData: any = [];

      // Conta quntidade de ecertos e salva no banco
      for (let i = 0; i < bettings.length; i += 1) {
        const dataWinner = verifyWinner.dataWinner(bettings[i], noDuplicates);
        // Cria um array de promises
        resultData.push(ReportModel.saveDataWinner(dataWinner));
      }
      // Executa o array de promises
      await Promise.all(resultData);
    } else {
      const resultData: any = [];

      for (let i = 0; i < bettings.length; i += 1) {
        const dataWinner = verifyWinner.dataWinner(bettings[i], noDuplicates);
        // Cria um array de promises
        resultData.push(
          ReportModel.updateDataWinner(dataWinner, {
            number_hits: dataWinner.numberHits,
          }),
        );
      }
      await Promise.all(resultData);
    }
  },
};

export default SaveWinnerInformationInTheWinnersTableService;
