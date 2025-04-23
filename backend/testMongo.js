const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://projeccttH55:barpass123@cluster0.twpdzpc.mongodb.net/loginDB?retryWrites=true&w=majority";

const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    await client.db("loginDB").command({ ping: 1 });
    console.log("You successfully connected to MongoDB!");
  } catch (err) {
    console.error("Connection failed:", err);
  } finally {
    await client.close();
  }
}

run();
