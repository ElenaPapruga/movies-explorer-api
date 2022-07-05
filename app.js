require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
// const cors = require('cors');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');
const { errorLogger, requestLogger } = require('./middlewares/logger');
const NotFoundError = require('./errors/notFoundError');

const {
  PORT = 3001,
  MONGO_URL,
  NODE_ENV,
  DEFAULT_URL = 'mongodb://localhost:27017/filmsdb',
} = process.env;

const app = express();

// eslint-disable-next-line consistent-return
const cors = (req, res, next) => {
  const { origin } = req.headers;
  const { method } = req;
  const requestHeaders = req.headers['access-control-request-headers'];
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

  res.header('Access-Control-Allow-Origin', origin);
  res.header('Access-Control-Allow-Credentials', true);

  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);

    return res.end();
  }
  next();
};

// cors
app.use(cors);

app.use(cookieParser());
app.use(express.json());
app.use(requestLogger);
app.use(routes);

// cитуации, в которых сервер падает, должны быть предусмотрены
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

// Обработки запросов на несуществующий роут
app.use((response, request, next) => {
  next(new NotFoundError('Ошибка. Страница не существует'));
});

mongoose.connect(NODE_ENV === 'production' ? MONGO_URL : DEFAULT_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
app.use(errorLogger);
// Обработчик ошибок - celebrate
app.use(errors());
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`Сервис запущен. Вы в безопасности. Порт: ${PORT}`);
});
