const { MongoClient } = require("mongodb");

let sentMessages;

async function connectDB() {

  const client = new MongoClient("mongodb://mongodb:27017");
  await client.connect();
  const db = client.db("whatsapp_service_db"); 
  sentMessages = db.collection("sent_messages");
  console.log("Connected to MongoDB");
}

module.exports = { connectDB, sentMessages };
