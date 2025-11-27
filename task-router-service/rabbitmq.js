const amqp = require("amqplib");

let channel;

async function initRabbitMQ() {
  const user = process.env.RABBITMQ_USER || "user";
  const pass = process.env.RABBITMQ_PASS || "password";

  const conn = await amqp.connect(`amqp://${user}:${pass}@rabbitmq:5672`);
  channel = await conn.createChannel();
  await channel.assertExchange("delivery", "topic", { durable: true });

  return channel;
}

function getChannel() {
  if (!channel) throw new Error("RabbitMQ channel not initialized yet");
  return channel;
}

module.exports = { initRabbitMQ, getChannel };
