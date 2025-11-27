const express = require("express");
const { connectDB, messages } = require("./db");
const { initRabbitMQ } = require("./rabbitmq");
const { initLogger, log } = require("./logger");

const app = express();
app.use(express.json());

let rabbitChannel;

async function init() {
  try {

    await connectDB();


    rabbitChannel = await initRabbitMQ();


    await initLogger();

    console.log("Task Router Ready");
  } catch (err) {
    console.error("Initialization error:", err);
  }
}


app.post("/message/send", async (req, res) => {
  try {
    const { id, body, channel: route } = req.body;

    if (!id || !body || !route) {
      return res.status(400).json({ error: "Invalid payload" });
    }


    const duplicate = await messages().findOne({ id });
    if (duplicate) {
      log({ type: "duplicate", id });
      return res.json({ status: "duplicate_ignored" });
    }


    await messages().insertOne({ id, body, route });


    rabbitChannel.publish(
      "delivery",
      `delivery.${route}`,
      Buffer.from(JSON.stringify(req.body))
    );


    log({ type: "routed", id, route });

    res.json({ status: "queued" });
  } catch (err) {
    console.error("Error processing message:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.listen(3000, () => console.log("Task Router running on 3000"));


init();
