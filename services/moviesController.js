const { json } = require('express');
const fs = require('fs');
const util = require('util')
const path = require('path');
const { nextTick } = require('process');
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
    async createMovieObject(updatedmovie,moviename) {
        try { 
            var datas = await this.getData();
        var movieindex=datas.movies.findIndex((element) => {element.title==moviename})
       
        if(movieindex){
            datas.movies.splice(movieindex,1,updatedmovie)
            console.log("only during update")
        }else
        {
        updatedmovie.id=datas.movies.length;
        datas.movies.push(updatedmovie) 
        }
    
        return datas;
            
        } catch (error) {
            return error;
        }
       
    }

    async addMoive(movie,moviename, file) {
        const datas = await this.createMovieObject(movie,moviename);
        var moviedata = JSON.stringify(datas);
        await writeFile(file, moviedata);
    }
    async removeMoive(moviename, file) {
        try {
            const datas = await this.getData();
            var index=datas.movies.findIndex(item=>item.title==moviename);
            console.log(index)
            datas.movies.splice(index,1)
            var result = await writeFile(file, JSON.stringify(datas));
            console.log("successfully deleted")
            return result;
        }
        catch (err) {
            return err;
        }
    }
    
    //update movie
    async updateMoive( movie,moviename, file) {
        try {
           await this.addMoive(movie,moviename,file)
        }
        catch (err) {
            return err;
        }
    }

}//End of class

module.exports = MovieServicer;