class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409; // фильм с таким ID уже существует
  }
}

module.exports = ConflictError;
