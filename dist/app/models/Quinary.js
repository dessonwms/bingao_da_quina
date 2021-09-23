"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _db = _interopRequireDefault(require("../../config/db"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const QuinaryModel = {
  all(bingoId) {
    return _db.default.query(`
    SELECT * FROM quinarys
    WHERE bingo_id = ${bingoId}
    ORDER BY updated_at DESC
    `);
  },

  allTen() {
    return _db.default.query(`SELECT * FROM quinarys_ten ORDER BY ten ASC`);
  },

  async find(id) {
    return _db.default.query('SELECT * FROM quinarys WHERE id = $1', [id]);
  },

  async selectLast(data) {
    try {
      const query = `SELECT ${data.fields} FROM ${data.table}
          ORDER BY ${data.orderField} ${data.order}
          LIMIT ${data.limit}`;
      const results = await _db.default.query(query);
      return results.rows[0];
    } catch (err) {
      return `Error: ${err}`;
    }
  },

  async create(data) {
    try {
      const query = `
      INSERT INTO quinarys (
          contest,
          contestdata,
          ten_first,
          ten_second,
          ten_third,
          ten_forth,
          ten_fifth,
          bingo_id
      ) VALUES ( $1, $2, $3, $4, $5, $6, $7, $8 )
      RETURNING id
      `;
      const values = [data.contest, data.contestdata, data.ten_first, data.ten_second, data.ten_third, data.ten_forth, data.ten_fifth, data.bingoId];
      const results = await _db.default.query(query, values);
      return results.rows[0].id;
    } catch (err) {
      console.log(`Error: ${err}`);
      return `Error: ${err}`;
    }
  },

  async update(id, fields) {
    let query = 'UPDATE quinarys SET';
    Object.keys(fields).map((key, index, array) => {
      if (index + 1 < array.length) {
        query = `${query}
          ${key} = '${fields[key]}',
        `;
      } else {
        query = `${query}
          ${key} = '${fields[key]}'
          WHERE id = ${id}
        `;
      }

      return true;
    });
    await _db.default.query(query);
  }

};
var _default = QuinaryModel;
exports.default = _default;