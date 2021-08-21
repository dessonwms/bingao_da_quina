import express from 'express';
import nunjucks from 'nunjucks';
import routes from './routes';

const app = express();

app.use(express.static('src/public'));

nunjucks.configure('src/views', {
  express: app,
});

app.set('view engine', 'njk');

app.use(routes);

app.listen(3333, () => {
  console.log('Server started in port 3333!');
});
