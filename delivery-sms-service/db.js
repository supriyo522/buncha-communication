const { MongoClient } = require("mongodb");

let sentMessages;

async function connectDB() {
  const client = new MongoClient("mongodb://mongodb:27017");
  await client.connect();
  const db = client.db("sms_service_db");
  sentMessages = db.collection("sent_messages");
}

module.exports = { connectDB, sentMessages };
