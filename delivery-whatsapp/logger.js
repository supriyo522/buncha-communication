const amqp = require("amqplib");

let logChannel;

async function initLogger() {
  const user = process.env.RABBITMQ_USER || "user";
  const pass = process.env.RABBITMQ_PASS || "password";

  const conn = await amqp.connect(`amqp://${user}:${pass}@rabbitmq:5672`);
  logChannel = await conn.createChannel();
  await logChannel.assertQueue("logs");
}

function log(evt) {
  if (!logChannel) return;
  logChannel.sendToQueue("logs", Buffer.from(JSON.stringify(evt)));
}

module.exports = { initLogger, log };
