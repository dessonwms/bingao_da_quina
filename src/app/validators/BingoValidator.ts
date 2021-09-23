import BingoModel from '../models/Bingo';

const BingoValidator = {
  // eslint-disable-next-line consistent-return
  filterBingo: async (request: any, response: any, next: any) => {
    try {
      // Seleciona o último registro de Bingo
      // Retorna lista de Bingos
      const results = await BingoModel.all();
      const numRows = results.rowCount;

      if (numRows === 0) {
        return response.render('bingo/first_register');
      }

      next();
    } catch (err) {
      return response.render('bingo/index', {
        error: 'Algum erro aconteceu',
      });
    }
  },
};

export default BingoValidator;
