import express from 'express';
import nunjucks from 'nunjucks';
import methodOverride from 'method-override';
import routes from './routes';
import session from './config/session';

const app = express();

// Sessão de usuário
app.use(session);
// Cria variável global que pode ser acessada no Nunjunks
app.use((request, response, next) => {
  response.locals.session = request.session;
  next();
});

// Configura Express para ler dados enviados pelo req.body (POST)
app.use(express.urlencoded({ extended: true }));

// Configuração que permite leitura de arquivos estaticos
app.use(express.static('public'));

// Faz com que a aplicação reconheça metodos PUT e etc no envio de formulários
app.use(methodOverride('_method'));

app.use(routes);

// Configuração da Template Engine
app.set('view engine', 'njk');
nunjucks.configure('src/app/views', {
  express: app,
  autoescape: false,
  noCache: true,
});

app.listen(3333, () => {
  console.log('Server started in port 3333!');
});
