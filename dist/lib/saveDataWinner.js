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
    let hasWinner = 0;

    for (let i = 0; i < bettings.length; i += 1) {
      var _bettings$i11, _bettings$i12, _bettings$i13, _bettings$i14, _bettings$i15, _bettings$i16, _bettings$i17, _bettings$i18, _bettings$i19, _bettings$i20;

      betting = [(_bettings$i11 = bettings[i]) === null || _bettings$i11 === void 0 ? void 0 : _bettings$i11.first_ten, (_bettings$i12 = bettings[i]) === null || _bettings$i12 === void 0 ? void 0 : _bettings$i12.second_ten, (_bettings$i13 = bettings[i]) === null || _bettings$i13 === void 0 ? void 0 : _bettings$i13.third_ten, (_bettings$i14 = bettings[i]) === null || _bettings$i14 === void 0 ? void 0 : _bettings$i14.forth_ten, (_bettings$i15 = bettings[i]) === null || _bettings$i15 === void 0 ? void 0 : _bettings$i15.fifth_ten, (_bettings$i16 = bettings[i]) === null || _bettings$i16 === void 0 ? void 0 : _bettings$i16.sixth_ten, (_bettings$i17 = bettings[i]) === null || _bettings$i17 === void 0 ? void 0 : _bettings$i17.seventh_ten, (_bettings$i18 = bettings[i]) === null || _bettings$i18 === void 0 ? void 0 : _bettings$i18.eighth_ten, (_bettings$i19 = bettings[i]) === null || _bettings$i19 === void 0 ? void 0 : _bettings$i19.ninth_ten, (_bettings$i20 = bettings[i]) === null || _bettings$i20 === void 0 ? void 0 : _bettings$i20.tenth_ten];

      if (verifyWinner.arraysEqual(betting, noDuplicates)) {
        hasWinner += 1;
      }
    }

    return {
      hasWinner
    };
  }

};
var _default = verifyWinner;
exports.default = _default;