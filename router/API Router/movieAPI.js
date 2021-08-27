

const express = require('express')
const movieRouter = express.Router()

module.exports=(params)=>{
    var {movieService}=params;  
movieRouter.get('/all',async(req,res)=>{
console.log("hert");
  res.json(await movieService.getAllMovies())
  })

  movieRouter.get('/:movie',async(req,res)=>{
    let movie=await movieService.getMovieDetails(req.params.movie)
    res.json(movie)
  })
  movieRouter.delete('/:movie',async(req,res)=>{
        let movie=await movieService.removeMoive(req.params.movie,'./Modal/moviedb.json')
        res.json(movie)
      })


  return movieRouter;
}


