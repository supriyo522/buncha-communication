const { MongoClient } = require("mongodb");

let client;
let db;

async function connectDB() {
  const mongoHost = process.env.MONGO_HOST || "127.0.0.1";
  const mongoPort = process.env.MONGO_PORT || 27017;

  client = new MongoClient(`mongodb://${mongoHost}:${mongoPort}`);
  await client.connect();

  db = client.db("email_service_db");
  console.log("MongoDB connected for Email Service");
}


function getSentMessagesCollection() {
  if (!db) throw new Error("Database not initialized yet");
  return db.collection("sent_messages");
}

module.exports = { connectDB, getSentMessagesCollection };
