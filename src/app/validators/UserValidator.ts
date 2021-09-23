import { compare } from 'bcryptjs';
import UserModel from '../models/User';
import UserLevel from '../models/UserLevel';

const Validator = {
  show: async (request: any, response: any, next: any) => {
    try {
      const { userId: id } = request.session;

      const user = await UserModel.findOne({ where: { id } });

      if (!user)
        return response.render('user/register', {
          error: 'Usuário não encontrado',
        });

      request.user = user;

      next();

      return request.user;
    } catch (err) {
      return response.render('user/register', {
        error: 'Algum erro aconteceu',
      });
    }
  },

  post: async (request: any, response: any, next: any) => {
    try {
      // check if user exists [email]
      const { email } = request.body;
      const user = await UserModel.findOne({ where: { email } });

      const results = await UserLevel.all();
      const levels = results.rows;

      if (user)
        return response.render('user/register', {
          user: request.body,
          levels,
          error: 'Esse e-mail já pertence a outro usuário!',
        });

      next();

      return false;
    } catch (err) {
      return response.render('user/register', {
        error: 'Algum erro aconteceu',
      });
    }
  },

  // eslint-disable-next-line consistent-return
  update: async (request: any, response: any, next: any) => {
    try {
      const { id, email } = request.body; // extrair a senha caso queira validar senha

      const user = await UserModel.findOne({ where: { id } });

      const userEmail = await UserModel.findOne({ where: { email } });

      if (userEmail && user.id !== userEmail.id) {
        const results = await UserLevel.all();
        const levels = results.rows;

        return response.render('user/edit', {
          user: request.body,
          levels,
          error: 'Esse e-mail já pertence a outro usuário!',
        });
      }

      request.user = user;

      next();
    } catch (err) {
      return response.render('user/edit', {
        error: 'Algum erro aconteceu',
      });
    }
  },
  // eslint-disable-next-line consistent-return
  account: async (request: any, response: any, next: any) => {
    try {
      const { id, email, password } = request.body; // extrair a senha caso queira validar senha

      const user = await UserModel.findOne({ where: { id } });

      const userEmail = await UserModel.findOne({ where: { email } });

      if (userEmail && user.id !== userEmail.id) {
        const results = await UserLevel.all();
        const levels = results.rows;

        return response.render('user/account', {
          user: request.body,
          levels,
          error: 'Esse e-mail já pertence a outro usuário!',
        });
      }

      const passed = await compare(password, user.password);
      if (!passed)
        return response.render('user/account', {
          user: request.body,
          error: 'Senha incorreta!',
        });

      request.user = user;

      next();
    } catch (err) {
      return response.render('user/account', {
        error: 'Algum erro aconteceu',
      });
    }
  },
};

export default Validator;
