"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
const verifyWinner = {
  concatenateWithoutDuplicates(quinarys) {
    let arrayConcat = []; // A
    // const arrayFilter: any = []; // C

    for (let i = 0; i < quinarys.length; i += 1) {
      var _quinarys$i, _quinarys$i2, _quinarys$i3, _quinarys$i4, _quinarys$i5;

      arrayConcat = arrayConcat.concat([(_quinarys$i = quinarys[i]) === null || _quinarys$i === void 0 ? void 0 : _quinarys$i.ten_first, (_quinarys$i2 = quinarys[i]) === null || _quinarys$i2 === void 0 ? void 0 : _quinarys$i2.ten_second, (_quinarys$i3 = quinarys[i]) === null || _quinarys$i3 === void 0 ? void 0 : _quinarys$i3.ten_third, (_quinarys$i4 = quinarys[i]) === null || _quinarys$i4 === void 0 ? void 0 : _quinarys$i4.ten_forth, (_quinarys$i5 = quinarys[i]) === null || _quinarys$i5 === void 0 ? void 0 : _quinarys$i5.ten_fifth]); // console.log(`arrayConcat: ${arrayConcat}`);
    }

    return arrayConcat.filter((item, pos) => arrayConcat.indexOf(item) === pos).sort(verifyWinner.compareNumbers);
  },

  compareNumbers(a, b) {
    // Função usada para ordenar os valores no método SORT
    return a - b;
  },

  arraysEqual(array1, array2) {
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

  countNumber(array1, array2) {
    let count = 0;

    for (let i = 0; i < array1.length; i += 1) {
      if (array2.includes(array1[i])) {
        count += 1;
      }
    }

    return count;
  },

  hasWinner(bettings, noDuplicates) {
    let betting = [];
    let hasWinner = 0;

    for (let i = 0; i < bettings.length; i += 1) {
      var _bettings$i, _bettings$i2, _bettings$i3, _bettings$i4, _bettings$i5, _bettings$i6, _bettings$i7, _bettings$i8, _bettings$i9, _bettings$i10;

      betting = [(_bettings$i = bettings[i]) === null || _bettings$i === void 0 ? void 0 : _bettings$i.first_ten, (_bettings$i2 = bettings[i]) === null || _bettings$i2 === void 0 ? void 0 : _bettings$i2.second_ten, (_bettings$i3 = bettings[i]) === null || _bettings$i3 === void 0 ? void 0 : _bettings$i3.third_ten, (_bettings$i4 = bettings[i]) === null || _bettings$i4 === void 0 ? void 0 : _bettings$i4.forth_ten, (_bettings$i5 = bettings[i]) === null || _bettings$i5 === void 0 ? void 0 : _bettings$i5.fifth_ten, (_bettings$i6 = bettings[i]) === null || _bettings$i6 === void 0 ? void 0 : _bettings$i6.sixth_ten, (_bettings$i7 = bettings[i]) === null || _bettings$i7 === void 0 ? void 0 : _bettings$i7.seventh_ten, (_bettings$i8 = bettings[i]) === null || _bettings$i8 === void 0 ? void 0 : _bettings$i8.eighth_ten, (_bettings$i9 = bettings[i]) === null || _bettings$i9 === void 0 ? void 0 : _bettings$i9.ninth_ten, (_bettings$i10 = bettings[i]) === null || _bettings$i10 === void 0 ? void 0 : _bettings$i10.tenth_ten];

      if (verifyWinner.arraysEqual(betting, noDuplicates)) {
        hasWinner += 1;
      }
    }

    return {
      hasWinner
    };
  },

  dataWinner(bettings, noDuplicates) {
    let betting = [];
    betting = [bettings === null || bettings === void 0 ? void 0 : bettings.first_ten, bettings === null || bettings === void 0 ? void 0 : bettings.second_ten, bettings === null || bettings === void 0 ? void 0 : bettings.third_ten, bettings === null || bettings === void 0 ? void 0 : bettings.forth_ten, bettings === null || bettings === void 0 ? void 0 : bettings.fifth_ten, bettings === null || bettings === void 0 ? void 0 : bettings.sixth_ten, bettings === null || bettings === void 0 ? void 0 : bettings.seventh_ten, bettings === null || bettings === void 0 ? void 0 : bettings.eighth_ten, bettings === null || bettings === void 0 ? void 0 : bettings.ninth_ten, bettings === null || bettings === void 0 ? void 0 : bettings.tenth_ten];
    const numberHits = verifyWinner.countNumber(betting, noDuplicates);
    return {
      bingoId: bettings.bingo_id,
      userId: bettings.user_id,
      bettingId: bettings.id,
      numberHits
    };
  }

};
var _default = verifyWinner;
exports.default = _default;