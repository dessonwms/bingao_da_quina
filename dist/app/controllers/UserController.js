"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _User = _interopRequireDefault(require("../models/User"));

var _UserLevel = _interopRequireDefault(require("../models/UserLevel"));

var _format = _interopRequireDefault(require("../../lib/format"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const UserController = {
  async show(request, response) {
    try {
      // Retorna lista de administradores
      const results = await _User.default.all();
      let users = results.rows;
      const usersPromise = users.map(async user => {
        // eslint-disable-next-line no-param-reassign
        user.phone = _format.default.phone(user.phone);
        return user;
      });
      users = await Promise.all(usersPromise);
      return response.render('user/index', {
        users
      });
    } catch (err) {
      return response.render('user/index', {
        error: 'Algum erro aconteceu'
      });
    }
  },

  async registerForm(request, response) {
    try {
      // Busca lista de níveis de acesso de usuários
      const results = await _UserLevel.default.all();
      const levels = results.rows;
      return response.render('user/register', {
        levels
      });
    } catch (err) {
      return response.render('user/register', {
        error: 'Algum erro aconteceu'
      });
    }
  },

  async post(request, response) {
    try {
      // Salva no banco de dados
      await _User.default.create(request.body); // Retorna lista de administradores

      const results = await _User.default.all();
      let users = results.rows;
      const usersPromise = users.map(async user => {
        // eslint-disable-next-line no-param-reassign
        user.phone = _format.default.phone(user.phone);
        return user;
      });
      users = await Promise.all(usersPromise);
      return response.render('user/index', {
        users,
        success: 'Usuário cadastrado com sucesso!'
      });
    } catch (err) {
      return response.render('user/index', {
        error: 'Algum erro aconteceu'
      });
    }
  },

  async edit(request, response) {
    try {
      let results = await _User.default.find(request.params.id);
      const user = results.rows[0];
      results = await _UserLevel.default.all();
      const levels = results.rows; // Formata Phone para mostrar Phone com máscara

      user.phone = _format.default.phone(user.phone);
      return response.render('user/edit', {
        user,
        levels
      });
    } catch (err) {
      return response.render('user/edit', {
        error: 'Algum erro aconteceu'
      });
    }
  },

  async update(request, response) {
    try {
      const {
        user
      } = request;
      const {
        name,
        phone,
        email,
        level
      } = request.body;
      await _User.default.update(user.id, {
        name,
        phone: phone.replace(/\D/g, ''),
        email,
        level
      }); // Retorna lista de administradores

      let results = await _User.default.all();
      const users = results.rows;
      const usersPromise = users.map(async userFormat => {
        // eslint-disable-next-line no-param-reassign
        userFormat.phone = _format.default.phone(userFormat.phone);
        return userFormat;
      });
      const lastAdded = await Promise.all(usersPromise); // Busca lista de níveis de acesso de usuários

      results = await _UserLevel.default.all();
      const levels = results.rows;
      return response.render('user/index', {
        users: lastAdded,
        levels,
        success: 'Conta atualizada com sucesso!'
      });
    } catch (err) {
      return response.render('user/index', {
        error: 'Algum erro aconteceu'
      });
    }
  },

  async account(request, response) {
    try {
      // let results = await UserModel.find(request.params.id);
      const {
        userId
      } = request.session;
      let results = await _User.default.find(userId);
      const user = results.rows[0];
      results = await _UserLevel.default.all();
      const levels = results.rows; // Formata Phone para mostrar Phone com máscara

      user.phone = _format.default.phone(user.phone);
      return response.render('user/account', {
        user,
        levels
      });
    } catch (err) {
      return response.render('user/account', {
        error: 'Algum erro aconteceu'
      });
    }
  },

  async updateAccount(request, response) {
    try {
      const user = request.body;
      const {
        name,
        phone,
        email
      } = request.body;
      await _User.default.update(user.id, {
        name,
        phone: phone.replace(/\D/g, ''),
        email
      }); // Formata o telefone do usuário para mostrar no form

      user.phone = _format.default.phone(user.phone); // Busca lista de níveis de acesso de usuários

      const results = await _UserLevel.default.all();
      const levels = results.rows; // Atualiza os dados do usuário na sessão

      request.session.name = user.name;
      request.session.save(() => {
        request.session.reload(() => {});
      });
      return response.render('user/account', {
        user,
        levels,
        success: 'Conta atualizada com sucesso!'
      });
    } catch (err) {
      return response.render('user/account', {
        error: 'Algum erro aconteceu'
      });
    }
  }

};
var _default = UserController;
exports.default = _default;