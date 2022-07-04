const winston = require('winston');
const expressWinston = require('express-winston');

// Создадим логгер запросов
const requestLogger = expressWinston.logger({
  transports: [ // Опция transports отвечает за то, куда нужно писать лог
    new winston.transports.File({ filename: 'request.log' }),
  ],
  format: winston.format.json(),
});

// Создадим логгер ошибок
const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.File({ filename: 'error.log' }),
  ],
  format: winston.format.json(),
});

// Ошибки мы пишем в отдельный файл — error.log
module.exports = {
  requestLogger,
  errorLogger,
};
