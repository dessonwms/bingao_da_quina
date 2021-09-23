"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _db = _interopRequireDefault(require("../../config/db"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const BingoModel = {
  all() {
    return _db.default.query(`
    SELECT * FROM bingos
    ORDER BY updated_at DESC
    `);
  },

  async find(id) {
    return _db.default.query('SELECT * FROM bingos WHERE id = $1', [id]);
  },

  async create(data, userId) {
    try {
      const query = `
      INSERT INTO bingos (
        edition,
        start_date,
        status,
        released_bets,
        user_id
    ) VALUES ( $1, $2, $3, $4, $5 )
    RETURNING id
    `;
      const values = [data.edition, data.start_date, 'ATIVO', 'B', userId];
      const results = await _db.default.query(query, values);
      return results.rows[0].id;
    } catch (err) {
      console.log(`Error: ${err}`);
      return `Error: ${err}`;
    }
  },

  async findActive() {
    return _db.default.query('SELECT * FROM bingos');
  },

  async update(id, fields) {
    let query = 'UPDATE bingos SET';
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
  }

};
var _default = BingoModel;
exports.default = _default;