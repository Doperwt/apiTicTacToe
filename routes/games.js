// routes/games.js
const router = require('express').Router()
const passport = require('../config/auth')
const { Game } = require('../models')
const utils = require('../lib/utils')
const gameLogic = require('./gamelogic')

const authenticate = passport.authorize('jwt', { session: false })
// var logic = new gameLogic()


console.log(gameLogic,'test')
module.exports = io => {
  router
    .get('/games', (req, res, next) => {
      Game.find()
        // Newest games first
        .sort({ createdAt: -1 })
        // Send the data in JSON format
        .then((games) => res.json(games))
        // Throw a 500 error if something goes wrong
        .catch((error) => next(error))
    })
    .get('/games/:id', (req, res, next) => {
      const id = req.params.id

      Game.findById(id)
        .then((game) => {
          if (!game) { return next() }
          res.json(game)
        })
        .catch((error) => next(error))
    })
    .post('/games', authenticate, (req, res, next) => {
      const newGame = {
        userId: req.account._id,
        players: [{
          userId: req.account._id,
        }],
        grid: [0,0,0,0,0,0,0,0,0],
        open: true,
      }

      Game.create(newGame)
        .then((game) => {
          io.emit('action', {
            type: 'GAME_CREATED',
            payload: game
          })
          res.json(game)
        })
        .catch((error) => next(error))
    })
    .put('/games/:id', authenticate, (req, res, next) => {
      const id = req.params.id
      const updatedGame = req.body
      Game.findByIdAndUpdate(id, { $set: updatedGame }, { new: true })
        .then((game) => {
          io.emit('action', {
            type: 'GAME_UPDATED',
            payload: game
          })
          res.json(game)
        })
        .catch((error) => next(error))
    })
    .patch('/games/:id', authenticate, (req, res, next) => {
      const id = req.params.id
      const updateLoc = req.body.loc

      Game.findById(id)
        .then((game) => {
          if (!game) { return next() }
          let patchForGame = JSON.parse(JSON.stringify(game))
          console.log(patchForGame.players[0].userId,patchForGame.players[1].userId,req.account._id,'player1,player2,currentuser')
          console.log('check player',gameLogic.checkPlayer(req.account._id, patchForGame.players[patchForGame.turn].userId),'check loc',gameLogic.isTaken(patchForGame.grid,updateLoc),"OVER HERE")
          if(gameLogic.isTaken(patchForGame.grid,updateLoc)&&gameLogic.checkPlayer(req.account._id, patchForGame.players[patchForGame.turn].userId)){
            if (patchForGame.turn === 1 ){ patchForGame.grid[updateLoc] = 1; patchForGame.turn = 0 }
            else { patchForGame.grid[updateLoc] = 2;   patchForGame.turn = 1}
          }
          console.log('winner',gameLogic.hasWon(patchForGame.grid),'change',patchForGame.grid[updateLoc],"HERE")
          if(gameLogic.hasWon(patchForGame.grid != null)){
            patchForGame.winnerId = patchForGame.players[(gameLogic.hasWon(patchForGame.grid))].userId
            io.emit('action', {
              type: 'winner winner',
              payload: patchForGame.winnerId,
            })
          }
          const updatedGame = { ...game, ...patchForGame}


          Game.findByIdAndUpdate(id, { $set: updatedGame }, { new: true })
            .then((game) => {
              io.emit('action', {
                type: 'GAME_UPDATED',
                payload: game
              })
              res.json(game)
            })
            .catch((error) => next(error))
        })
        .catch((error) => next(error))
    })
    .delete('/games/:id', authenticate, (req, res, next) => {
      const id = req.params.id
      Game.findByIdAndRemove(id)
        .then(() => {
          io.emit('action', {
            type: 'GAME_REMOVED',
            payload: id
          })
          res.status = 200
          res.json({
            message: 'Removed',
            _id: id
          })
        })
        .catch((error) => next(error))
    })

  return router
}
