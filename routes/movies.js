const router = require('express').Router();
const { validationMovie, validationIdMovie } = require('../validation/validation');

const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');

router.get('/', getMovies);

router.post('/', validationMovie, createMovie);

router.delete('/:_id', validationIdMovie, deleteMovie);

module.exports = router;
