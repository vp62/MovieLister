const express = require('express')
const indexRouter = express.Router()
const movieRouter = require('./movies')
const categoryRouter = require('./categories')
const { Router } = require('express')

module.exports = (params) => {

    var { movieService } = params;
    indexRouter.use(async (req, res, next) => {
        res.locals.list = await movieService.getGenre();
        // console.log(req.locals.list)
        next()
        // res.end()
    })
    indexRouter.get('/', async (req, res) => {
        var data = await movieService.getGenre();
        // console.log(data)
        res.render('layout', { list: data, movies: '', hello: "Heloo", content: "home" })
    })
    indexRouter.use('/movies', movieRouter(params))
    indexRouter.use('/category', categoryRouter(params))
    return indexRouter;
}