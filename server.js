const express = require('express')
var app = express();
const path = require('path')
var Router = require('./router/indexRouter')
const methodOverride = require('method-override');
const movieServicer = require('./services/moviesController');
const indexRouter = require('./router/indexRouter');

app.use(methodOverride('_method'));
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
  console.log("error")
  if (err.status != 404) {
    res.locals.status=err.status;
    res.locals.message=err.message;
    return res.render('error')
  }
  console.log(res.locals.list)
  res.render('layout', {
    status: err.status,
    message: err.message || "Ennatha solla", content: 'pageError'
  })
})

app.listen(3000, () => console.log("http://localhost:3000"))
