/* eslint-disable no-unused-vars */
import { compare } from 'bcryptjs';
import UserModel from '../models/User';

// eslint-disable-next-line consistent-return
function checkAllFields(body: any) {
  const keys = Object.keys(body);

  // eslint-disable-next-line no-restricted-syntax
  for (const key of keys) {
    if (body[key] === '') {
      return {
        user: body,
        error: 'Por favor, preencha todos os campos.',
      };
    }
  }
}

const SessionValidator = {
  // eslint-disable-next-line consistent-return
  login: async (request: any, response: any, next: any) => {
    // check if has all fields
    const fillAllFields = checkAllFields(request.body);
    if (fillAllFields) {
      return response.render('session/login', fillAllFields);
    }

    const { email, password } = request.body;

    const user = await UserModel.findOne({ where: { email } });

    // Verificar se o usuário está cadastrado
    if (!user)
      return response.render('session/login', {
        user: request.body,
        error: 'Usuário ou senha incorretos!',
      });

    // Verificar se o password confere
    const passed = await compare(password, user.password);

    if (!passed)
      return response.render('session/login', {
        user: request.body,
        error: 'Usuário ou senha incorretos',
      });

    request.user = user;

    next();
  },
  // eslint-disable-next-line consistent-return
  forgot: async (request: any, response: any, next: any) => {
    const { email } = request.body;

    try {
      const user = await UserModel.findOne({ where: { email } });

      // Verificar se o usuário está cadastrado
      if (!user)
        return response.render('session/password_forgot', {
          user: request.body,
          error: 'E-mail não cadastrado!',
        });

      request.user = user;

      next();
    } catch (error) {
      console.error(error);
    }
  },
  // eslint-disable-next-line consistent-return
  reset: async (request: any, response: any, next: any) => {
    // Procura o usuário
    const { email, password, passwordRepeat, token } = request.body;

    const user = await UserModel.findOne({ where: { email } });

    // Verificar se o usuário está cadastrado
    if (!user)
      return response.render('session/password_reset', {
        user: request.body,
        token,
        error: 'Usuário não cadastrado!',
      });

    // Verifica se as senhas são idênticas
    if (password !== passwordRepeat)
      return response.render('session/password_reset', {
        user: request.body,
        token,
        error: 'A senha e a repetição da senha estão incorretas.',
      });

    // Verifica se o token confere
    if (token !== user.reset_token)
      return response.render('session/password_reset', {
        user: request.body,
        token,
        error: 'Token inválido! Solicite uma nova recuperação de senha.',
      });

    // /verifica se o token não expirou
    const now = new Date();
    const nowMili = now.setHours(now.getHours());

    if (nowMili > user.reset_token_expires) {
      console.log(token);
      return response.render('session/password_reset', {
        user: request.body,
        token,
        error: 'Token expirado! Solicite uma nova recuperação de senha.',
      });
    }

    request.user = user;

    next();
  },
};

export default SessionValidator;
