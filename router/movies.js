const express = require('express')
const router = express.Router();
const { body, validationResult, check } = require('express-validator');
const movieServicer = require('../services/moviesController')
const path = require('path');
const { error } = require('console');
const { json } = require('express');
var movieService = new movieServicer('./Modal/moviedb.json');

module.exports = (param) => {
    router.use(express.static(path.join('public')))

    var { movieService } = param;


    router.get('/', async (req, res, next) => {
        try {
            var cat = await movieService.getGenre();
            const movies = await movieService.getAllMovies();
            res.render('layout', { list: cat, movies: movies, hello: "", content: 'movies' })
        } catch (err) {
            console.log("error here");
            next(err);
        }
    })
   
    router.get('/:movie', async (req, res,next) => {
        try {
            console.log(req.params.movie+"from individual movie name")
            var movie = await movieService.getMovieDetails(req.params.movie);
            // console.log(movie)
            var cat = await movieService.getGenre();
            res.render('layout', { movies: movie, list: cat, hello: '', content: 'individualMovies', type: req.params.category })
        } catch (err) {
            console.log("movie error")
            err.status=404;
            err.message=`We dont have this ${req.params.movie}`
           next(err)
        }
    })

    router.get('/as/addMovies', async (req, res) => {
        try {
            var cat = await movieService.getGenre();
            res.render('layout', { content: 'newMovie', list: cat, url: "/movies/as/addMovies", moviename:'', method: "POST", movie: { title: '', runtime: '', year: '', geners: [], actors: [], plot: '', posterUrl: '' } })
        }
        catch (err) {
            console.log('aed')
            res.status(404).send("err")
        }
    })
    router.post('/as/addMovies',
        check('title').not().isEmpty().trim()
        , async (req, res) => {
            try {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {

                    throw new Error({ errors: errors.array() });
                }
                console.log(`BODY:${req.body.title}`)
                const data = await movieService.addMoive(req.body,req.body.title, './Modal/moviedb.json');
                res.redirect('/movies')
            }
            catch (err) {
                console.log("error catched" + err)
                res.status(404).send(err)
            }
        })
    router.delete('/:movie', async (req, res) => {
        try {
            console.log(`BODY:${req.body}`)
            const data = await movieService.removeMoive(req.params.movie, './Modal/moviedb.json');
            res.redirect('/movies')
        }
        catch (err) {
            res.status(404).send(err);
        }

    })

    router.get('/update/:movie', async (req, res) => {
        try {
            console.log(req.params.movie)
            const data = await movieService.getMovieDetails(req.params.movie)
            // console.log(data)
            res.render('layout', { movie: data, moviename:req.params.movie,content: 'newMovie', url: `/movies/${req.params.movie}?_method=PUT`, method: "POST" })
        }
        catch (err) {
            res.status(404).send(err);
        }

    })
    router.put('/:movie', async (req, res) => {
        try {
            console.log("put")
            console.log(req.params.movie)
            const data = await movieService.updateMoive(req.body,req.params.movie, './Modal/moviedb.json')
            console.log(data+"put data")
            res.redirect('/movies')
            // res.render('layout',{movie:data,content:'newMovie',url: "/movies/as/updateMovies",method:"POST" })
        }
        catch (err) {
            res.status(404).send(err);
        }

    })


    return router;
}