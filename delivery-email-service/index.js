const { connectDB, getSentMessagesCollection } = require("./db");
const { initRabbitMQ } = require("./rabbitmq");
const { initLogger, log } = require("./logger");

async function init() {
  await connectDB();
  const { channel, queue } = await initRabbitMQ();
  await initLogger();

  console.log("Email Service running...");

  channel.consume(queue.queue, async (msg) => {
    const data = JSON.parse(msg.content.toString());


    if (Math.random() < 0.2) {
      console.log("EMAIL FAILED → RETRYING");
      return channel.nack(msg, false, true);
    }

    const sentMessages = getSentMessagesCollection();

    await sentMessages.insertOne({
      ...data,
      sentAt: new Date(),
      status: "sent"
    });

    log({ type: "sent", channel: "email", id: data.id });

    console.log(`EMAIL SENT → ID: ${data.id}`);
    channel.ack(msg);
  });
}

init().catch(err => console.error(err));
