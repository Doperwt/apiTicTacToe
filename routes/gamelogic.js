
const gameLogic = {
 isTaken:function(grid,location){
    if(grid[location] === 0){return true}
    else {return false}
  },
   setGrid: function(grid,location,value){
    grid[location] = value
    return grid
  },
   checkPlayer: function(player,turn){
    if (player == turn){return true}
    else {return false}
  },
  hasWon:function(grid){
    let winner
    let checks = [[0,1,2],[3,4,5],[6,7,8],[0,4,8],[6,4,2],[0,3,6],[1,4,7],[2,5,8]]
    checks.forEach(function(a){
      let b = a.map(c => grid[c] )
      if(b[0]===b[1] && b[0]===b[2]){
        if( gameLogic.endGame(b[0])){
          winner = b[0]-1
          console.log('winner',winner,'endgame:',gameLogic.endGame(b[0]))
        }
      }
    })
    winner
  },
  endGame:function(winner){
    if(winner ===0 ){
      return false
    }
    else if(winner===1){
      return true
    }
    else {
      return true
    }
  }
}
module.exports = gameLogic
