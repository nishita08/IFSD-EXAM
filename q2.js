const { MongoClient } = require("mongodb");
const prompt = require("prompt-sync")();

// Connection URI and Database Name
const uri = "mongodb+srv://nishitabbsc22:Nishita23@cluster0.mun1usw.mongodb.net/?retryWrites=true&w=majority";
const dbName = "teamPlayersDB";

// Collection and Field Names
const collectionName = "players";
const scoreFieldName = "scores";

let client; // MongoDB client

// Function to connect to MongoDB
async function connectToMongoDB() {
  try {
    client = new MongoClient(uri, { useUnifiedTopology: true });
    await client.connect();
    console.log("Connected to MongoDB successfully!");
    return client.db(dbName);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

// Function to disconnect from MongoDB
async function disconnectFromMongoDB() {
  try {
    await client.close();
    console.log("Disconnected from MongoDB.");
  } catch (error) {
    console.error("Error disconnecting from MongoDB:", error);
  }
}

// Function to insert a new player with scores
async function createPlayer() {
  try {
    const name = prompt("Enter player name: ");
    const scores = prompt("Enter scores (comma-separated): ")
      .split(",")
      .map(Number);

    const db = await connectToMongoDB();
    const collection = db.collection(collectionName);
    await collection.insertOne({ name, scores });
    console.log("Player created successfully!");
  } catch (error) {
    console.error("Error creating player:", error);
  }
}

// Function to retrieve all players
async function readAllPlayers() {
  try {
    const db = await connectToMongoDB();
    const collection = db.collection(collectionName);
    const players = await collection.find().toArray();
    console.log("All Players:");
    players.forEach(displayPlayerStats);
  } catch (error) {
    console.error("Error retrieving players:", error);
  }
}

// Function to update player scores
async function updatePlayer() {
  try {
    const name = prompt("Enter player name to update: ");
    const scores = prompt("Enter updated scores (comma-separated): ")
      .split(",")
      .map(Number);

    const db = await connectToMongoDB();
    const collection = db.collection(collectionName);
    await collection.updateOne({ name }, { $set: { scores } });
    console.log("Player updated successfully!");
  } catch (error) {
    console.error("Error updating player:", error);
  }
}

// Function to delete a player
async function deletePlayer() {
  try {
    const name = prompt("Enter player name to delete: ");

    const db = await connectToMongoDB();
    const collection = db.collection(collectionName);
    await collection.deleteOne({ name });
    console.log("Player deleted successfully!");
  } catch (error) {
    console.error("Error deleting player:", error);
  }
}

// Function to calculate average, minimum, and maximum scores of a player
function calculatePlayerStats(player) {
  const average = player[scoreFieldName].reduce(
    (total, score) => total + score,
    0
  ) / player[scoreFieldName].length;
  const minimum = Math.min(...player[scoreFieldName]);
  const maximum = Math.max(...player[scoreFieldName]);
  return { average, minimum, maximum };
}

// Function to display player stats
function displayPlayerStats(player) {
  console.log(`Player: ${player.name}`);
  console.log("Scores:", player[scoreFieldName]);
  const stats = calculatePlayerStats(player);
  console.log("Average Score:", stats.average);
  console.log("Minimum Score:", stats.minimum);
  console.log("Maximum Score:", stats.maximum);
  console.log("--------------------");
}

// Main function
async function main() {
  try {
    await connectToMongoDB();

    while (true) {
      console.log("=== Team-Player Database ===");
      console.log("1. Create a player");
      console.log("2. Read all players");
      console.log("3. Update player scores");
      console.log("4. Delete a player");
      console.log("5. Exit");

      const choice = prompt("Enter your choice: ");

      switch (choice) {
        case "1":
          await createPlayer();
          break;
        case "2":
          await readAllPlayers();
          break;
        case "3":
          await updatePlayer();
          break;
        case "4":
          await deletePlayer();
          break;
        case "5":
          console.log("Exiting...");
          await disconnectFromMongoDB();
          return;
        default:
          console.log("Invalid choice. Try again.");
      }
    }
  } catch (error) {
    console.error("Error in main:", error);
  }
}

main().catch((error) => console.error("Error in main:", error));
