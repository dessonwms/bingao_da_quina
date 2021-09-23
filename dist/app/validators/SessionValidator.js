"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _bcryptjs = require("bcryptjs");

var _User = _interopRequireDefault(require("../models/User"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-unused-vars */
// eslint-disable-next-line consistent-return
function checkAllFields(body) {
  const keys = Object.keys(body); // eslint-disable-next-line no-restricted-syntax

  for (const key of keys) {
    if (body[key] === '') {
      return {
        user: body,
        error: 'Por favor, preencha todos os campos.'
      };
    }
  }
}

const SessionValidator = {
  // eslint-disable-next-line consistent-return
  login: async (request, response, next) => {
    try {
      // check if has all fields
      const fillAllFields = checkAllFields(request.body);

      if (fillAllFields) {
        return response.render('session/login', fillAllFields);
      }

      const {
        email,
        password
      } = request.body;
      const user = await _User.default.findOne({
        where: {
          email
        }
      }); // Verificar se o usuário está cadastrado

      if (!user) return response.render('session/login', {
        user: request.body,
        error: 'Usuário ou senha incorretos!'
      }); // Verificar se o password confere

      const passed = await (0, _bcryptjs.compare)(password, user.password);
      if (!passed) return response.render('session/login', {
        user: request.body,
        error: 'Usuário ou senha incorretos'
      });
      request.user = user;
      next();
    } catch (err) {
      return response.render('session/login', {
        error: 'Algum erro aconteceu'
      });
    }
  },
  // eslint-disable-next-line consistent-return
  forgot: async (request, response, next) => {
    try {
      const {
        email
      } = request.body;
      const user = await _User.default.findOne({
        where: {
          email
        }
      }); // Verificar se o usuário está cadastrado

      if (!user) return response.render('session/password_forgot', {
        user: request.body,
        error: 'E-mail não cadastrado!'
      });
      request.user = user;
      next();
    } catch (err) {
      return response.render('session/password_forgot', {
        error: 'Algum erro aconteceu'
      });
    }
  },
  // eslint-disable-next-line consistent-return
  reset: async (request, response, next) => {
    try {
      // Procura o usuário
      const {
        email,
        password,
        passwordRepeat,
        token
      } = request.body;
      const user = await _User.default.findOne({
        where: {
          email
        }
      }); // Verificar se o usuário está cadastrado

      if (!user) return response.render('session/password_reset', {
        user: request.body,
        token,
        error: 'Usuário não cadastrado!'
      }); // Verifica se as senhas são idênticas

      if (password !== passwordRepeat) return response.render('session/password_reset', {
        user: request.body,
        token,
        error: 'A senha e a repetição da senha estão incorretas.'
      }); // Verifica se o token confere

      if (token !== user.reset_token) return response.render('session/password_reset', {
        user: request.body,
        token,
        error: 'Token inválido! Solicite uma nova recuperação de senha.'
      }); // /verifica se o token não expirou

      const now = new Date();
      const nowMili = now.setHours(now.getHours());

      if (nowMili > user.reset_token_expires) {
        console.log(token);
        return response.render('session/password_reset', {
          user: request.body,
          token,
          error: 'Token expirado! Solicite uma nova recuperação de senha.'
        });
      }

      request.user = user;
      next();
    } catch (err) {
      return response.render('session/password_reset', {
        error: 'Algum erro aconteceu'
      });
    }
  }
};
var _default = SessionValidator;
exports.default = _default;