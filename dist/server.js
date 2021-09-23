"use strict";

var _express = _interopRequireDefault(require("express"));

var _nunjucks = _interopRequireDefault(require("nunjucks"));

var _methodOverride = _interopRequireDefault(require("method-override"));

var _routes = _interopRequireDefault(require("./routes"));

var _session = _interopRequireDefault(require("./config/session"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = (0, _express.default)(); // Sessão de usuário

app.use(_session.default); // Cria variável global que pode ser acessada no Nunjunks

app.use((request, response, next) => {
  response.locals.session = request.session;
  next();
}); // Configura Express para ler dados enviados pelo req.body (POST)

app.use(_express.default.urlencoded({
  extended: true
})); // Configuração que permite leitura de arquivos estaticos

app.use(_express.default.static('public')); // Faz com que a aplicação reconheça metodos PUT e etc no envio de formulários

app.use((0, _methodOverride.default)('_method'));
app.use(_routes.default); // Configuração da Template Engine

app.set('view engine', 'njk');

_nunjucks.default.configure('src/app/views', {
  express: app,
  autoescape: false,
  noCache: true
});

app.listen(3333, () => {
  console.log('Server started in port 3333!');
});