// models/game.js
const mongoose = require('../config/database')
const { Schema } = mongoose

// const gridSchema = new Schema({
//   grid: { a1: Number, a2: Number, a3: Number, b1: Number, b2: Number, b3: Number, c1: Number, c2: Number, c3: Number},
// });

const playerSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'users' },
});

const gameSchema = new Schema({
  grid: [Number],
  players: [playerSchema],
  turn: { type: Number, default: 0 }, // player index
  started: { type: Boolean, default: false },
  winnerId: { type: Schema.Types.ObjectId, ref: 'users' },
  userId: { type: Schema.Types.ObjectId, ref: 'users' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  lastCard: { type: Number },
  draw: { type: Boolean, default: false },
  open: {type:Boolean, default:true},
});

module.exports = mongoose.model('games', gameSchema)
