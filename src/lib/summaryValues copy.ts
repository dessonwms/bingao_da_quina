const summaryValues = {
  valueBet: 50,
  grandTotal(totalBets: any) {
    const value = summaryValues.valueBet * totalBets;
    // const value = 9350;
    return value;
  },
  firstPlaceAward(value: any) {
    const totalAward = (80 / 100) * value;
    const total = (80 / 100) * totalAward;
    return total;
  },
  secondPlaceAward(value: any) {
    const totalAward = (80 / 100) * value;
    const total = (10 / 100) * totalAward;
    return total;
  },
  minorHitAward(value: any) {
    const totalAward = (80 / 100) * value;
    const total = (10 / 100) * totalAward;
    return total;
  },
  prizePerWinner(ranking: any, filter: any, value: any) {
    let prize;

    for (let i = 0; i < ranking.length; i += 1) {
      if (ranking[i].number_hits === filter) {
        prize = value / ranking[i].count;
        break;
      }
    }
    return prize;
  },
  administrationFee(value: any) {
    const total = (20 / 100) * value;
    return total;
  },
  generateRankingData(ratings: any) {
    const ranking: any = [];

    let j = 0;

    for (let i = 10; i >= 0; i -= 1) {
      if (ratings[j]?.number_hits === i) {
        ranking.push(ratings[j]);
        // console.log(`i: ${i} - j: ${j}`);
        // console.log(`ratings[j]?.number_hits: ${ratings[j]?.number_hits}`);
        // console.log('Existe');
        // console.log('Adiciona o objeto');
        // console.log('Incrementa a variavel "i"');
        // console.log('----------');

        if (ratings[j]?.number_hits === ratings[0].minimo) {
          break;
        }

        j += 1;
      } else {
        ranking.push({
          number_hits: i,
          count: '0',
          minimo: ratings[0].minimo,
          totalbets: ratings[0].totalbets,
        });

        // console.log(`i: ${i} - j: ${j}`);
        // console.log(`ratings[j]?.number_hits: ${ratings[j]?.number_hits}`);
        // console.log('Não Existe');
        // console.log('Cria o objeto');
        // console.log('Mantém o valor de "i"');
        // console.log('----------');
      }
    }

    return ranking;
  },
};

export default summaryValues;
