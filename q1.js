const prompt = require('prompt-sync')();

class Player {
  constructor(scores) {
    this.scores = scores;
  }

  getAverageScore() {
    let sum = this.scores.reduce((total, score) => total + score, 0);
    return sum / this.scores.length;
  }

  getMinimumScore() {
    return Math.min(...this.scores);
  }

  getMaximumScore() {
    return Math.max(...this.scores);
  }
}

class Team {
  constructor() {
    this.players = [];
  }

  addPlayer(player) {
    this.players.push(player);
  }

  getAverageScore() {
    let playerAverages = this.players.map((player) => player.getAverageScore());
    let sum = playerAverages.reduce((total, average) => total + average, 0);
    return sum / playerAverages.length;
  }

  getMinimumScore() {
    let playerMinimums = this.players.map((player) => player.getMinimumScore());
    return Math.min(...playerMinimums);
  }

  getMaximumScore() {
    let playerMaximums = this.players.map((player) => player.getMaximumScore());
    return Math.max(...playerMaximums);
  }
}

function main() {
  const team = new Team();

  const numPlayers = parseInt(prompt("Enter the number of players:"));

  for (let i = 0; i < numPlayers; i++) {
    const playerScores = prompt(`Enter the scores for player ${i + 1} (comma-separated):`)
      .split(",")
      .map(Number);
    const player = new Player(playerScores);
    team.addPlayer(player);
  }

  console.log("Average score of the team:", team.getAverageScore());
  console.log("Minimum score of the team:", team.getMinimumScore());
  console.log("Maximum score of the team:", team.getMaximumScore());
}

main();
