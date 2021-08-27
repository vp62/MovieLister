const express = require('express')
const APIRouter = express.Router()
const movieRouter = require('./movieAPI')

module.exports=(params)=>{
console.log("hert from api router");

APIRouter.use('/',movieRouter(params))
return APIRouter;
}
