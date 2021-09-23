"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _bcryptjs = require("bcryptjs");

var _User = _interopRequireDefault(require("../models/User"));

var _UserLevel = _interopRequireDefault(require("../models/UserLevel"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Validator = {
  show: async (request, response, next) => {
    try {
      const {
        userId: id
      } = request.session;
      const user = await _User.default.findOne({
        where: {
          id
        }
      });
      if (!user) return response.render('user/register', {
        error: 'Usuário não encontrado'
      });
      request.user = user;
      next();
      return request.user;
    } catch (err) {
      return response.render('user/register', {
        error: 'Algum erro aconteceu'
      });
    }
  },
  post: async (request, response, next) => {
    try {
      // check if user exists [email]
      const {
        email
      } = request.body;
      const user = await _User.default.findOne({
        where: {
          email
        }
      });
      const results = await _UserLevel.default.all();
      const levels = results.rows;
      if (user) return response.render('user/register', {
        user: request.body,
        levels,
        error: 'Esse e-mail já pertence a outro usuário!'
      });
      next();
      return false;
    } catch (err) {
      return response.render('user/register', {
        error: 'Algum erro aconteceu'
      });
    }
  },
  // eslint-disable-next-line consistent-return
  update: async (request, response, next) => {
    try {
      const {
        id,
        email
      } = request.body; // extrair a senha caso queira validar senha

      const user = await _User.default.findOne({
        where: {
          id
        }
      });
      const userEmail = await _User.default.findOne({
        where: {
          email
        }
      });

      if (userEmail && user.id !== userEmail.id) {
        const results = await _UserLevel.default.all();
        const levels = results.rows;
        return response.render('user/edit', {
          user: request.body,
          levels,
          error: 'Esse e-mail já pertence a outro usuário!'
        });
      }

      request.user = user;
      next();
    } catch (err) {
      return response.render('user/edit', {
        error: 'Algum erro aconteceu'
      });
    }
  },
  // eslint-disable-next-line consistent-return
  account: async (request, response, next) => {
    try {
      const {
        id,
        email,
        password
      } = request.body; // extrair a senha caso queira validar senha

      const user = await _User.default.findOne({
        where: {
          id
        }
      });
      const userEmail = await _User.default.findOne({
        where: {
          email
        }
      });

      if (userEmail && user.id !== userEmail.id) {
        const results = await _UserLevel.default.all();
        const levels = results.rows;
        return response.render('user/account', {
          user: request.body,
          levels,
          error: 'Esse e-mail já pertence a outro usuário!'
        });
      }

      const passed = await (0, _bcryptjs.compare)(password, user.password);
      if (!passed) return response.render('user/account', {
        user: request.body,
        error: 'Senha incorreta!'
      });
      request.user = user;
      next();
    } catch (err) {
      return response.render('user/account', {
        error: 'Algum erro aconteceu'
      });
    }
  }
};
var _default = Validator;
exports.default = _default;