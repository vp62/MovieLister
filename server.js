const express = require('express')
var app = express();
const path = require('path')
var Router = require('./router/indexRouter')
// var moviesRoutes=require('./router/movies')

const movieServicer = require('./services/moviesController');
const indexRouter = require('./router/indexRouter');
const { render } = require('ejs');


var categoryService = new movieServicer('./Modal/moviedb.json');
var movieService = new movieServicer('./Modal/moviedb.json');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join('public')))



app.use('/', indexRouter(
  {
    categoryService: categoryService,
    movieService: movieService
  }
))


app.use((req, res, next) => {
  let err = new Error("file Not Found")
  err.status = 404
  err.message = "sorry this was an temporary issue we are trying to resolve it"
  console.log(`call next with error ${err}`)
  console.log('1st use')
  next(err)
})

app.use((err, req, res, next) => {
  // res.status(err.status || 500)
  console.log("error")
  // console.log(err.status)
  if (err.status != 404) {
    return res.render('error')
  }
  console.log(res.locals.list)
  res.render('layout', {
    status: err.status,
    message: err.message || "Ennatha solla", content: 'pageError'
  })
})

app.listen(3000, () => console.log("http://localhost:3000"))