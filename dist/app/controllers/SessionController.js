"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _crypto = _interopRequireDefault(require("crypto"));

var _bcryptjs = require("bcryptjs");

var _User = _interopRequireDefault(require("../models/User"));

var _mailer = _interopRequireDefault(require("../../lib/mailer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const SessionController = {
  loginForm(request, response) {
    return response.render('session/login');
  },

  login(request, response) {
    request.session.userId = request.user.id;
    request.session.name = request.user.name;
    request.session.level = request.user.level;
    return response.redirect('/');
  },

  logout(request, response) {
    request.session.destroy();
    return response.redirect('/');
  },

  forgotForm(request, response) {
    return response.render('session/password_forgot');
  },

  async forgot(request, response) {
    const {
      user
    } = request;

    try {
      // Cria um token para o usuário
      const token = _crypto.default.randomBytes(20).toString('hex'); // Cria uma expiração para o token


      const now = new Date();
      await _User.default.update(user.id, {
        reset_token: token,
        reset_token_expires: now.setHours(now.getHours() + 1)
      }); // Enviar um email com um link de recuperação de senha

      await _mailer.default.sendMail({
        to: user.email,
        from: 'no-reply@bingaodaquina.com.br',
        subject: 'Recuperação de senha',
        html: `<h2>Pedeu a chave?</h2>
        <p>Não se preocupe, clique no link abaixo para recuperar sua senha</p>
        <p>
          <a href="http://localhost:3333/users/password-reset?token=${token}" target="_blank">
            Recuperar senha
          <a/>
        </p>`
      }); // Avisar o usuário que enviamos o e-mail

      return response.render('session/password_forgot', {
        success: 'Verifique seu email para resetar sua senha'
      });
    } catch (err) {
      return response.render('session/password_forgot', {
        error: 'Erro inesperado, tente novamente!'
      });
    }
  },

  resetForm(request, response) {
    return response.render('session/password_reset', {
      token: request.query.token
    });
  },

  async reset(request, response) {
    const {
      user
    } = request;
    const {
      password,
      token
    } = request.body;

    try {
      // Cria um novo hash de senha
      const newPassword = await (0, _bcryptjs.hash)(password, 8); // Atualiza o usuário

      await _User.default.update(user.id, {
        password: newPassword,
        reset_token: '',
        reset_token_expires: ''
      }); // Avisa o usuário que ele tem uma nova senha

      return response.render('session/login', {
        user: request.body,
        success: 'Senha atualizada! Faça o seu login!'
      });
    } catch (err) {
      return response.render('session/password_reset', {
        user: request.body,
        token,
        error: 'Erro inesperado, tente novamente!'
      });
    }
  }

};
var _default = SessionController;
exports.default = _default;