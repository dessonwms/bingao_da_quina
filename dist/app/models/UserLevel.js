"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _db = _interopRequireDefault(require("../../config/db"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const UserModelLevel = {
  all() {
    const query = `
    SELECT * FROM user_level WHERE id = $1 OR id = $2
      `;
    const values = [2, 3];
    return _db.default.query(query, values);
  }

};
var _default = UserModelLevel;
exports.default = _default;