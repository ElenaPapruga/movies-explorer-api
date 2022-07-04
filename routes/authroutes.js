const router = require('express').Router();
const { createUser, login } = require('../controllers/users');

const {
  validationLogin,
  validationUser,
} = require('../validation/validation');

router.post('/signup', validationUser, createUser);
router.post('/signin', validationLogin, login);

module.exports = router;
