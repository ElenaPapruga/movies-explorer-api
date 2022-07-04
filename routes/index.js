const router = require('express').Router();
const NotFoundError = require('../errors/notFoundError');
const usersRout = require('./users');
const routerAuth = require('./authroutes');
const auth = require('../middlewares/auth');
const routerMovie = require('./movies');

router.use(routerAuth);
router.use(auth);
router.use('./users', usersRout);
router.use('./movies', routerMovie);
router.all('*', (res, req, next) => {
  next(new NotFoundError('Ошибка 404 - страницы не существует'));
});

module.exports = router;
