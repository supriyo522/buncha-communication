const amqp = require("amqplib");

let logChannel;

async function initLogger() {
  const rabbitHost = process.env.RABBITMQ_HOST || "127.0.0.1";
  const rabbitPort = process.env.RABBITMQ_PORT || 5672;
  const rabbitUser = process.env.RABBITMQ_USER || "user";
  const rabbitPass = process.env.RABBITMQ_PASS || "password";

  const conn = await amqp.connect(`amqp://${rabbitUser}:${rabbitPass}@${rabbitHost}:${rabbitPort}`);
  logChannel = await conn.createChannel();
  await logChannel.assertQueue("logs");

  console.log("Logger connected to RabbitMQ");
}

function log(evt) {
  logChannel.sendToQueue("logs", Buffer.from(JSON.stringify(evt)));
}

module.exports = { initLogger, log };
