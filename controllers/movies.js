const Movie = require('../models/movie');

const BadRequestError = require('../errors/badRequestError');
const ConflictError = require('../errors/conflictError');
const NotFoundError = require('../errors/notFoundError');
const ForbiddenError = require('../errors/forbiddenError');

const getMovies = async (request, response, next) => {
  try {
    const movie = await Movie.find({});
    response.status(201).send(movie);
  } catch (err) {
    next(err);
  }
};

// Функция удаления фильма
const deleteMovie = (request, response, next) => {
  const { _id } = request.params;
  Movie.findById(_id)
    .orFail(() => new NotFoundError('Ошибка 404 - фильма не существует'))
    .then((movie) => {
      if (request.user._id.toString() === movie.owner.toString()) {
        movie.remove()
          .then(() => {
            response.status(201).send({ message: 'Фильм удален.' });
          })
          .catch(next);
      } else {
        throw new ForbiddenError('Ошибка 403 - недостаточно прав для удаления фильма');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные при создании карточки'));
      } else next(err);
    });
};

// Создание нового фильма
const createMovie = async (request, response, next) => {
  const {
    director,
    country,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = request.body;
  try {
    const movie = await Movie.create({
      director,
      country,
      duration,
      year,
      description,
      image,
      trailerLink,
      thumbnail,
      movieId,
      nameRU,
      nameEN,
      owner: request.user._id,
    });
    response.status(201).send(movie);
  } catch (err) {
    if (err.name === 'CastError' || err.name === 'ValidationErorr') {
      next(new BadRequestError('Ошибка 400 - Введены некорректные данные'));
    } else if (err.name === 'MongoServerError' && err.code === 11000) {
      next(new ConflictError('Ошибка 409 - Фильм с таким ID уже существует'));
    } else next(err);
  }
};

module.exports = {
  getMovies,
  deleteMovie,
  createMovie,
};
