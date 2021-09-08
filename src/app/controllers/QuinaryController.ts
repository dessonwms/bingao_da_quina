/* eslint-disable camelcase */
import QuinaryModel from '../models/Quinary';
import BingoModel from '../models/Bingo';

import format from '../../lib/utils';

const PunterController = {
  async registerForm(request: any, response: any) {
    // Seleciona o último registro (Usado para informar o campo sorteio automaticamente)
    const quinaryLast = await BingoModel.selectLast({
      fields: '*',
      table: 'quinarys',
      orderField: 'id',
      order: 'DESC',
      limit: 1,
    });
    quinaryLast.contest += 1;

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

    return response.render('quinary/register', {
      quinaryContest: quinaryLast,
      quinarys: quinarysList,
      bingoId: bingo.id,
    });
  },
  async post(request: any, response: any) {
    // Salva no banco de dados
    await QuinaryModel.create(request.body);

    // Seleciona o último registro (Usado para informar o campo sorteio automaticamente)
    const quinaryLast = await BingoModel.selectLast({
      fields: '*',
      table: 'quinarys',
      orderField: 'id',
      order: 'DESC',
      limit: 1,
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

    return response.render('quinary/register', {
      quinaryContest: quinaryLast,
      quinarys: quinarysList,
      success: 'Sorteio cadastrado com sucesso!',
    });
  },
  async edit(request: any, response: any) {
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

      return response.render('quinary/edit', {
        quinary,
        quinarys: quinarysList,
        success: 'Dados atualizados com sucesso!',
      });
    } catch (err) {
      console.log(`Erro: ${err}`);
      return response.render('quinary/edit', {
        error: 'Algum erro aconteceu',
      });
    }
  },
};

export default PunterController;
