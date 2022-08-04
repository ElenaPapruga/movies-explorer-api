const bcrypt = require('bcrypt'); // хеширование пароля
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const BadRequestError = require('../errors/badRequestError');
const ConflictError = require('../errors/conflictError');
const UnauthorizedError = require('../errors/unauthorizedError');
const NotFoundError = require('../errors/notFoundError');

const {
  NODE_ENV,
  JWT_SECRET,
} = process.env;

// Новый пользователь
const createUser = (request, response, next) => {
  const {
    name,
    email,
  } = request.body;
  bcrypt
    .hash(request.body.password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash, // записываем хеш в базу
    }))
    .then((user) => {
      const data = JSON.parse(JSON.stringify(user));
      delete data.password;
      response.status(201).send({ data });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Ошибка 400 - невалидные данные'));
      } else if (err.code === 11000) {
        next(new ConflictError('Ошибка 409 - пользователь с указанным email уже существует'));
      } else next(err);
    });
};

// Обновленный пользователь
const updateUser = async (request, response, next) => {
  try {
    const { name, email } = request.body;

    const user = await User.findByIdAndUpdate(
      request.user._id,
      { name, email },
      { new: true, runValidators: true },
    );
    response.status(201).send(user);
  } catch (err) {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      next(new BadRequestError('Ошибка 400 - некорректные данные при обновлении профиля'));
    } else if (err.name === 'MongoServerError' && err.code === 11000) {
      next(new ConflictError('Ошибка 409 - пользователь с указанным email уже существует'));
    } else next(err);
  }
};

// Контроллер login
const login = (request, response, next) => {
  const { email, password } = request.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return next(new UnauthorizedError('Ошибка 401 - невозможно авторизоваться'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return next(new UnauthorizedError('Ошибка 401 - невозможно авторизоваться'));
          }
          // создадим токен
          const token = jwt.sign(
            {
              _id: user._id,
              email: user.email,
              name: user.name,
            },
            NODE_ENV === 'production' ? JWT_SECRET : 'secretkey',
            { expiresIn: '7d' },
          );
          // вернём токен
          return response
            .send({ token });
        });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Ошибка 400 - некорректные данные'));
      } else next(err);
    });
};

const getCurrentUser = (request, response, next) => User.findById(request.user._id)
  .orFail(() => {
    throw new NotFoundError('Ошибка 404 - пользователь не найден');
  })
  .then((user) => response.status(201).send({ user }))
  .catch((err) => {
    if (err.name === 'CastError') {
      next(new BadRequestError('Ошибка 400 - некорректные данные'));
    } else if (err.name === 'NotFoundError') {
      next(new NotFoundError('Ошибка 404 - пользователь не найден'));
    } else next(err);
  });

// Контроллер logout
const logout = (request, response, next) => {
  User
    .findOne({ _id: request.user._id })
    .then(() => response.clearCookie('jwt').send({}))
    .catch(next);
};

module.exports = {
  createUser,
  updateUser,
  login,
  logout,
  getCurrentUser,
};
