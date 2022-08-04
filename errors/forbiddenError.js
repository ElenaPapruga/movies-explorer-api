class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403; // недостаточно прав для удаления фильма
  }
}

module.exports = ForbiddenError;
