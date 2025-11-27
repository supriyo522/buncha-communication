const { connectDB, sentMessages } = require("./db");
const { initRabbitMQ } = require("./rabbitmq");
const { initLogger, log } = require("./logger");

async function init() {
  await connectDB();
  const { channel, queue } = await initRabbitMQ();
  await initLogger();

  console.log("SMS Service running...");

  channel.consume(queue.queue, async (msg) => {
    const data = JSON.parse(msg.content.toString());


    if (Math.random() < 0.2) {
      console.log("SMS FAILED → RETRYING...");
      return channel.nack(msg, false, true);
    }

    await sentMessages.insertOne({
      ...data,
      sentAt: new Date(),
      status: "sent"
    });

    log({ type: "sent", channel: "sms", id: data.id });

    channel.ack(msg);
  });
}

init();
