const router = require('express').Router();

const { getCurrentUser, updateUser, logout } = require('../controllers/users');

const {
  validationUpdateUser,
} = require('../validation/validation');

router.get('/me', getCurrentUser);
router.patch('/me', validationUpdateUser, updateUser);

router.delete('/signout', logout);

module.exports = router;
