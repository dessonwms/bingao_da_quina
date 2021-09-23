"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _nodemailer = _interopRequireDefault(require("nodemailer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const transport = _nodemailer.default.createTransport({
  host: 'smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: '45a69237130382',
    pass: '12e2bb627d9897'
  }
});

var _default = transport;
exports.default = _default;