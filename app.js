require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('./middlewares/rateLimit');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');
const { errorLogger, requestLogger } = require('./middlewares/logger');

// Проверка

const {
  PORT = 3005,
  MONGO_URL,
  NODE_ENV,
  DEFAULT_URL = 'mongodb://localhost:27017/moviesdb',
} = process.env;

const app = express();

// cors
console.log(cors);
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://localhost:3000',
    'http://localhost:3005',
    'https://localhost:3005',
    'https://epapruga.nomoredomains.sbs',
    'http://epapruga.nomoredomains.sbs',
    'https://api.epapruga.nomoredomains.sbs',
    'http://api.epapruga.nomoredomains.sbs',
  ],
  methods: ['GET', 'HEAD', 'PATCH', 'POST', 'PUT', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json());
app.use(requestLogger);
app.use(rateLimit); // число запросов с одного IP в единицу времени ограничено
app.use(helmet());
app.use(routes);

// cитуации, в которых сервер падает, должны быть предусмотрены
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
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
