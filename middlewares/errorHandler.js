// Централизованный бработчик ошибок
const errorHandler = (err, request, response, next) => {
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? 'Ошибка на сервере' : err.message;
  response.status(statusCode)
    .send({ message });
  next();
};

module.exports = errorHandler;
