const verifyWinner = {
  concatenateWithoutDuplicates(quinarys: any) {
    let arrayConcat: any = []; // A
    // const arrayFilter: any = []; // C

    for (let i = 0; i < quinarys.length; i += 1) {
      arrayConcat = arrayConcat.concat([
        quinarys[i]?.ten_first,
        quinarys[i]?.ten_second,
        quinarys[i]?.ten_third,
        quinarys[i]?.ten_forth,
        quinarys[i]?.ten_fifth,
      ]);
      // console.log(`arrayConcat: ${arrayConcat}`);
    }
    return arrayConcat
      .filter((item: any, pos: any) => arrayConcat.indexOf(item) === pos)
      .sort(verifyWinner.compareNumbers);
  },
  compareNumbers(a: any, b: any) {
    // Função usada para ordenar os valores no método SORT
    return a - b;
  },
  arraysEqual(array1: any, array2: any) {
    let count = 0;

    for (let i = 0; i < array1.length; i += 1) {
      if (array2.includes(array1[i])) {
        count += 1;
      }
    }

    if (count !== 10) {
      return false;
    }

    return true;
  },
  countNumber(array1: any, array2: any) {
    let count = 0;

    for (let i = 0; i < array1.length; i += 1) {
      if (array2.includes(array1[i])) {
        count += 1;
      }
    }

    return count;
  },
  hasWinner(bettings: any, noDuplicates: any) {
    let betting: any = [];
    let hasWinner = 0;

    for (let i = 0; i < bettings.length; i += 1) {
      betting = [
        bettings[i]?.first_ten,
        bettings[i]?.second_ten,
        bettings[i]?.third_ten,
        bettings[i]?.forth_ten,
        bettings[i]?.fifth_ten,
        bettings[i]?.sixth_ten,
        bettings[i]?.seventh_ten,
        bettings[i]?.eighth_ten,
        bettings[i]?.ninth_ten,
        bettings[i]?.tenth_ten,
      ];
      if (verifyWinner.arraysEqual(betting, noDuplicates)) {
        hasWinner += 1;
      }
    }
    return { hasWinner };
  },
  dataWinner(bettings: any, noDuplicates: any) {
    let betting: any = [];

    betting = [
      bettings?.first_ten,
      bettings?.second_ten,
      bettings?.third_ten,
      bettings?.forth_ten,
      bettings?.fifth_ten,
      bettings?.sixth_ten,
      bettings?.seventh_ten,
      bettings?.eighth_ten,
      bettings?.ninth_ten,
      bettings?.tenth_ten,
    ];
    const numberHits = verifyWinner.countNumber(betting, noDuplicates);

    return {
      bingoId: bettings.bingo_id,
      userId: bettings.user_id,
      bettingId: bettings.id,
      numberHits,
    };
  },
};

export default verifyWinner;
