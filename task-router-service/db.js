const { MongoClient } = require("mongodb");

let messagesCollection;

async function connectDB() {
  const client = new MongoClient("mongodb://mongodb:27017");
  await client.connect();
  const db = client.db("task_router_db");
  messagesCollection = db.collection("messages");
  console.log("MongoDB connected for Task Router");
}


function messages() {
  if (!messagesCollection) throw new Error("MongoDB not connected yet");
  return messagesCollection;
}

module.exports = { connectDB, messages };
