const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const BadRequestError = require('../errors/badRequestError');

const validationUrl = (url) => {
  if (!validator.isURL(url, { require_protocol: true })) {
    throw new BadRequestError('Ошибка 400 - невалидный URL');
  }
  return url;
};

// Для роутера movies
const validationMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required().min(2),
    director: Joi.string().required().min(2),
    duration: Joi.number().required().min(2),
    year: Joi.string().required().min(2),
    description: Joi.string().required().min(2),
    image: Joi.string().required().custom(validationUrl),
    trailerLink: Joi.string().required().custom(validationUrl),
    thumbnail: Joi.string().required().custom(validationUrl),
    movieId: Joi.number().required().min(1),
    nameRU: Joi.string().required().min(2),
    nameEN: Joi.string().required().min(2),
  }),
});

// Для роутера movies
const validationIdMovie = celebrate({
  params: Joi.object().keys({
    _id: Joi.string().hex().length(24).required(),
  }),
});

// Для роутера authroutes
const validationUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(4),
  }),
});

// Для роутера authroutes
const validationLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(4),
  }),
});

// Для роута users
const validationUpdateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required()
      .messages({
        'string.min': 'Минимальная длина поля "name" - 2',
        'string.max': 'Максимальная длина поля "name" - 30',
        'any.required': 'Поле "name" должно быть заполнено',
      }),
    email: Joi.string().email().required()
      .messages({
        'any.required': 'Поле "email" должно быть заполнено',
      }),
  }),
});

module.exports = {
  validationUpdateUser,
  validationMovie,
  validationIdMovie,
  validationLogin,
  validationUser,
  validationUrl,
};
