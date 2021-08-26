const express = require('express')
const router = express.Router();

module.exports = (param) => {
    var cat;
    var { categoryService } = param;
    router.get('/:category', async (req, res, next) => {

        try {
            cat = await categoryService.getGenre();
            console.log(req.params.category)
            var data = await categoryService.getMovies(req.params.category);
            console.log(data.length)
            res.render('layout', { movies: data, list: cat || [], hello: '', content: 'movies', type: req.params.category })


        }

        catch (err) {
            console.log("error in hands")
            // console.log(err.message)
            err.status = 404;
            next(err)
        }
    })
    router.get('/movies/:movie', async (req, res, next) => {
        try {
            cat = await categoryService.getGenre();
            var data = await categoryService.getMovieDetails(req.params.movie);
            console.log(req.params.movie);
            res.render('layout', { movies: data, list: cat || [], hello: '', content: 'individualMovies', type: req.params.category })
        }
        catch (err) {
            next(err)
        }
    })
    router.get('/movies/:movie/delete', async (req, res, next) => {
        try {
            console.log(`BODY:${req.body}`)
            const data = await categoryService.removeMoive(req.params.movie, './Modal/moviedb.json');
            res.redirect('/movies')
        }
        catch (err) {
            next(err)
        }
    })

    return router;
}