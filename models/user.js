const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: [2, 'Поле name должно содержать минимум 2 сисмвола'],
    maxlength: [30, 'Поле name должно содержать максимум 30 сисмволов'],
  },

  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: (email) => validator.isEmail(email),
      message: 'Неалидный email',
    },
  },

  password: {
    type: String,
    select: false, // API не возвращает хеш пароля
    minlength: 6,
    required: true,
  },
});

module.exports = mongoose.model('user', userSchema);
