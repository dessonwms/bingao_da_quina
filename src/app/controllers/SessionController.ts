import crypto from 'crypto';
import { hash } from 'bcryptjs';
import UserModel from '../models/User';
import mailer from '../../lib/mailer';

const SessionController = {
  loginForm(request: any, response: any) {
    return response.render('session/login');
  },
  login(request: any, response: any) {
    request.session.userId = request.user.id;
    request.session.name = request.user.name;
    request.session.level = request.user.level;

    return response.redirect('/');
  },
  logout(request: any, response: any) {
    request.session.destroy();
    return response.redirect('/');
  },
  forgotForm(request: any, response: any) {
    return response.render('session/password_forgot');
  },
  async forgot(request: any, response: any) {
    const { user } = request;

    try {
      // Cria um token para o usuário
      const token = crypto.randomBytes(20).toString('hex');

      // Cria uma expiração para o token
      const now = new Date();

      await UserModel.update(user.id, {
        reset_token: token,
        reset_token_expires: now.setHours(now.getHours() + 1),
      });

      // Enviar um email com um link de recuperação de senha
      await mailer.sendMail({
        to: user.email,
        from: 'no-reply@bingaodaquina.com.br',
        subject: 'Recuperação de senha',
        html: `<h2>Pedeu a chave?</h2>
        <p>Não se preocupe, clique no link abaixo para recuperar sua senha</p>
        <p>
          <a href="http://localhost:3333/users/password-reset?token=${token}" target="_blank">
            Recuperar senha
          <a/>
        </p>`,
      });

      // Avisar o usuário que enviamos o e-mail
      return response.render('session/password_forgot', {
        success: 'Verifique seu email para resetar sua senha',
      });
    } catch (err) {
      console.log(`Erro: ${err}`);
      return response.render('session/password_forgot', {
        error: 'Erro inesperado, tente novamente!',
      });
    }
  },
  resetForm(request: any, response: any) {
    return response.render('session/password_reset', {
      token: request.query.token,
    });
  },
  async reset(request: any, response: any) {
    const { user } = request;

    const { password, token } = request.body;

    try {
      // Cria um novo hash de senha
      const newPassword = await hash(password, 8);

      // Atualiza o usuário
      await UserModel.update(user.id, {
        password: newPassword,
        reset_token: '',
        reset_token_expires: '',
      });
      // Avisa o usuário que ele tem uma nova senha
      return response.render('session/login', {
        user: request.body,
        success: 'Senha atualizada! Faça o seu login!',
      });
    } catch (err) {
      return response.render('session/password_reset', {
        user: request.body,
        token,
        error: 'Erro inesperado, tente novamente!',
      });
    }
  },
};

export default SessionController;
