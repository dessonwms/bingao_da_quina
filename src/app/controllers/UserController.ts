import UserModel from '../models/User';
import UserLevel from '../models/UserLevel';

import format from '../../lib/utils';

const UserController = {
  async show(request: any, response: any) {
    try {
      // Retorna lista de administradores
      const results = await UserModel.all();
      const users = results.rows;

      const usersPromise = users.map(async user => {
        // eslint-disable-next-line no-param-reassign
        user.phone = format.phone(user.phone);
        return user;
      });
      const lastAdded = await Promise.all(usersPromise);

      return response.render('user/index', { users: lastAdded });
    } catch (err) {
      return response.render('user/index', {
        error: 'Algum erro aconteceu',
      });
    }
  },
  async registerForm(request: any, response: any) {
    // Busca lista de níveis de acesso de usuários
    const results = await UserLevel.all();
    const levels = results.rows;

    return response.render('user/register', { levels });
  },
  async post(request: any, response: any) {
    // Salva no banco de dados
    await UserModel.create(request.body);

    // Retorna lista de administradores
    const results = await UserModel.all();
    const users = results.rows;

    return response.render('user/index', {
      users,
      success: 'Usuário cadastrado com sucesso!',
    });
  },
  async edit(request: any, response: any) {
    let results = await UserModel.find(request.params.id);
    const user = results.rows[0];

    results = await UserLevel.all();
    const levels = results.rows;

    // Formata Phone para mostrar Phone com máscara
    user.phone = format.phone(user.phone);

    return response.render('user/edit', { user, levels });
  },
  async update(request: any, response: any) {
    try {
      const { user } = request;

      const { name, phone, email, level } = request.body;

      await UserModel.update(user.id, {
        name,
        phone: phone.replace(/\D/g, ''),
        email,
        level,
      });

      // Retorna lista de administradores
      let results = await UserModel.all();
      const users = results.rows;

      const usersPromise = users.map(async userFormat => {
        // eslint-disable-next-line no-param-reassign
        userFormat.phone = format.phone(userFormat.phone);
        return userFormat;
      });
      const lastAdded = await Promise.all(usersPromise);

      // Busca lista de níveis de acesso de usuários
      results = await UserLevel.all();
      const levels = results.rows;

      return response.render('user/index', {
        users: lastAdded,
        levels,
        success: 'Conta atualizada com sucesso!',
      });
    } catch (err) {
      return response.render('user/account', {
        error: 'Algum erro aconteceu',
      });
    }
  },
  async account(request: any, response: any) {
    // let results = await UserModel.find(request.params.id);
    const { userId } = request.session;
    let results = await UserModel.find(userId);
    const user = results.rows[0];

    results = await UserLevel.all();
    const levels = results.rows;

    // Formata Phone para mostrar Phone com máscara
    user.phone = format.phone(user.phone);

    return response.render('user/account', { user, levels });
  },
  async updateAccount(request: any, response: any) {
    try {
      const user = request.body;

      const { name, phone, email } = request.body;

      await UserModel.update(user.id, {
        name,
        phone: phone.replace(/\D/g, ''),
        email,
      });

      // Formata o telefone do usuário para mostrar no form
      user.phone = format.phone(user.phone);

      // Busca lista de níveis de acesso de usuários
      const results = await UserLevel.all();
      const levels = results.rows;

      // Atualiza os dados do usuário na sessão
      request.session.name = user.name;
      request.session.save(() => {
        request.session.reload(() => {});
      });

      return response.render('user/account', {
        user,
        levels,
        success: 'Conta atualizada com sucesso!',
      });
    } catch (err) {
      return response.render('user/account', {
        error: 'Algum erro aconteceu',
      });
    }
  },
};

export default UserController;
