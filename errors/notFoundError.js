class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404; // 404 пользователь-карточка по данному корректному ID не найдены
  }
}

module.exports = NotFoundError;
