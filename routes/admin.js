var express = require('express');
const router = express.Router();

const genreController = require('../controllers/genreController');
const movieController = require('..//controllers/movieController')
const {isAdmin} = require('../middleware/auth-middelware')



router.get('/genres',isAdmin, genreController.genreGetAll);

router.get('/genre/create',isAdmin,  genreController.genreCreateGet);
router.post('/genre/create',isAdmin,  genreController.genreCreatePost);

router.get('/genre/:id/details',isAdmin,  genreController.displayGenreDetails);

router.get('/genre/:id/delete',isAdmin,  genreController.deleteGenreGet);
router.post('/genre/:id/delete',isAdmin,  genreController.deleteGenrePost);

router.get('/genre/:id/update',isAdmin,  genreController.updateGenreGet);
router.post('/genre/:id/update',isAdmin,  genreController.updateGenrePost)


router.get('/movie/create',isAdmin,  movieController.movieCreateGet);
router.post('/movie/create',isAdmin,  movieController.movieCreatePost);

router.get('/movies', movieController.movieGetAll);
router.get('/movie/:id/details',isAdmin,  movieController.displayMovieDetails);

router.get('/movie/:id/update',isAdmin, movieController.movieUpdateGet);
router.post('/movie/:id/update',isAdmin, movieController.updateMoviePost);

router.get('/movie/:id/delete',isAdmin, movieController.deleteMovieGet);
router.post('/movie/:id/delete',isAdmin, movieController.deleteMoviePost);

router.get('/',isAdmin,  function (req,res,err) {
    res.render('admin/home',{title: "Admin Panel"})

});



module.exports = router;