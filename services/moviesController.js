const { json } = require('express');
const fs = require('fs');
const util = require('util')
const path = require('path')
var readFile = util.promisify(fs.readFile);
var writeFile = util.promisify(fs.writeFile);

class MovieServicer {
    constructor(data) {
        this.data = data;
    }
    //get category
    async getGenre() {
        var datas = await readFile(this.data, 'utf-8');
        return JSON.parse(datas).genres;
    }
    async getData() {
        var datas = await readFile(this.data, 'utf-8');
        return JSON.parse(datas);
    }
    //get movie name based on category
    async getMovies(name) {

        var datas = await readFile(this.data, 'utf-8');
        datas = JSON.parse(datas)
        var movies = datas.movies.filter(element => {
            if (element.genres.includes(name)) {
                return element;
            }
        });
        if (typeof movies != 'undefined' && movies != null && movies.length > 0) {
            return movies;
        }
        else if (!datas.genres.includes()) {
            throw new Error(`No Category Exit like this ${name}`)
        }
        else {
            throw new Error('We dont have no collection on it')
        }


    }
    async getAllMovies() {
        var datas = await readFile(this.data, 'utf-8');
        var movies = JSON.parse(datas).movies;
        return movies;
    }
    //get movie details
    async getMovieDetails(name) {
        var datas = await readFile(this.data, 'utf-8');
        // console.log(datas)
        var movies = JSON.parse(datas).movies.find(element => element.title == name);
        // console.log(movies)
        return movies;
    }
    //create movie object
    async createMovieObject(movie) {
        var datas = await this.getData();
        movie.id = datas.movies.length;
        movie.genres = movie.genres.split(',');
        movie.actors = movie.actors.split(',');
        datas.movies.push(movie)
        return datas;
    }

    async addMoive(movie, file) {
        const datas = await this.createMovieObject(movie);
        var moviedata = JSON.stringify(datas);
        var result = await writeFile(file, moviedata);
        return datas.movies[datas.movies.length - 1
        ];
    }
    async removeMoive(moviename, file) {
        try {
            const datas = await this.getData();
            // console.log(moviename)
           datas.movies= datas.movies.filter(item => item.title != moviename);
        //    console.log(datas.movies)
            var movies = JSON.stringify(datas);
            // console.log(movies)
            var result = await writeFile(file, movies);
            console.log("successfully deleted")
            return result;
        }
        catch (err) {
            return err;
        }
    }

    //update movie
    async updateMoive(moviename, movie, file) {
        try {
            const datas = await this.getData();

            datas.movies.forEach(element => {
                if (element.title == moviename) {
                    element.title = movie.title;
                    element.year = movie.year;
                    element.actors = movie.actors.split(',');
                    element.genres = movie.genres.split(',');
                    element.runtime = movie.runtime;
                    element.plot = movie.plot;
                    element.posterUrl = movie.posterUrl; return;

                }
            });
            // var d=datas.movies.find(item.title==moviename)
            console.log("datas movies")
            console.log(datas.movies)
            var movies = JSON.stringify(datas); console.log(movies);

            var result = await writeFile(file, movies);
            // return result;
        }
        catch (err) {
            return err;
        }
    }

}//End of class

module.exports = MovieServicer;