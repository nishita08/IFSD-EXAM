const express = require('express');
const app = express();

app.use(express.json());

class Team {
  constructor(name, score) {
    this.name = name;
    this.score = score;
  }
}

class player {
  constructor() {
    this.players = [];
  }

  getinput(reqBody) {
    const { teamSize, playerScores } = reqBody;
    for (let i = 0; i < teamSize; i++) {
      const playerScore = parseInt(playerScores[i]);
      const team = new Team(`Player ${i}`, playerScore);
      this.players.push(team);
    }
  }

  claculateavgscore() {
    let totalScore = 0;
    for (let i = 0; i < this.players.length; i++) {
      totalScore += this.players[i].score;
    }
    this.avg = totalScore / this.players.length;
  }

  calculatemaxscore() {
    let maxScore = 0;
    for (let i = 0; i < this.players.length; i++) {
      if (this.players[i].score > maxScore) {
        maxScore = this.players[i].score;
      }
    }
    this.max = maxScore;
  }

  calculateminScore() {
  if (this.players.length === 0) {
    this.min = 0; // Set a default value or handle the empty array case as needed
    return;
  }

  let minScore = this.players[0].score;
  for (let i = 0; i < this.players.length; i++) {
    if (this.players[i].score < minScore) {
      minScore = this.players[i].score;
    }
  }
  this.min = minScore;
}

}

app.post('/calculate', (req, res) => {
  const Player = new player();
  Player.getinput(req.body);
  Player.claculateavgscore();
  Player.calculatemaxscore();
  Player.calculateminScore();
  const result = {
    averageScore: Player.avg,
    minimumScore: Player.min,
    maximumScore: Player.max
  };
  res.json(result);
});

// Start the server
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});