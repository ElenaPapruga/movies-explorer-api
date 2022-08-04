class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401; // 401 - Отсутствие токена, некорректный токен, невозможно авторизоваться
  }
}

module.exports = UnauthorizedError;
