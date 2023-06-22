const mongoose = require('mongoose');
const prompt = require('prompt-sync')();

// Connection URI and Database Name
const uri = "mongodb+srv://nishitabbsc22:Nishita23@cluster0.mun1usw.mongodb.net/teamplayer";
const dbName = 'teamPlayersDB';

// Connect to MongoDB
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, dbName })
  .then(() => {
    console.log('Connected to MongoDB successfully!');
    main();
  })
  .catch((error) => console.error('Error connecting to MongoDB:', error));

// Define the player schema
const playerSchema = new mongoose.Schema({
  name: String,
  scores: [Number]
});

// Create the Player model
const Player = mongoose.model('Player', playerSchema);

// Function to create a player
async function createPlayer() {
  try {
    const name = prompt('Enter player name: ');
    const scores = prompt('Enter scores (comma-separated): ')
      .split(',')
      .map(Number);

    await Player.create({ name, scores });
    console.log('Player created successfully!');
  } catch (error) {
    console.error('Error creating player:', error);
  }
}

// Function to retrieve all players
async function readAllPlayers() {
  try {
    const players = await Player.find();
    console.log('All Players:');
    players.forEach(displayPlayerStats);
  } catch (error) {
    console.error('Error retrieving players:', error);
  }
}

// Function to update player scores
async function updatePlayer() {
  try {
    const name = prompt('Enter player name to update: ');
    const scores = prompt('Enter updated scores (comma-separated): ')
      .split(',')
      .map(Number);

    await Player.findOneAndUpdate({ name }, { scores });
    console.log('Player updated successfully!');
  } catch (error) {
    console.error('Error updating player:', error);
  }
}

// Function to delete a player
async function deletePlayer() {
  try {
    const name = prompt('Enter player name to delete: ');

    await Player.deleteOne({ name });
    console.log('Player deleted successfully!');
  } catch (error) {
    console.error('Error deleting player:', error);
  }
}

// Function to calculate average, minimum, and maximum scores of a player
function calculatePlayerStats(player) {
  const average = player.scores.reduce((total, score) => total + score, 0) / player.scores.length;
  const minimum = Math.min(...player.scores);
  const maximum = Math.max(...player.scores);
  return { average, minimum, maximum };
}

// Function to display player stats
function displayPlayerStats(player) {
  console.log(`Player: ${player.name}`);
  console.log('Scores:', player.scores);
  const stats = calculatePlayerStats(player);
  console.log('Average Score:', stats.average);
  console.log('Minimum Score:', stats.minimum);
  console.log('Maximum Score:', stats.maximum);
  console.log('--------------------');
}

// Main function
async function main() {
  try {
    while (true) {
      console.log('=== Team-Player Database ===');
      console.log('1. Create a player');
      console.log('2. Read all players');
      console.log('3. Update player scores');
      console.log('4. Delete a player');
      console.log('5. Exit');

      const choice = prompt('Enter your choice: ');

      switch (choice) {
        case '1':
          await createPlayer();
          break;
        case '2':
          await readAllPlayers();
          break;
        case '3':
          await updatePlayer();
          break;
        case '4':
          await deletePlayer();
          break;
        case '5':
          console.log('Exiting...');
          mongoose.disconnect();
          return;
        default:
          console.log('Invalid choice. Try again.');
      }
    }
  } catch (error) {
    console.error('Error in main:', error);
  }
}