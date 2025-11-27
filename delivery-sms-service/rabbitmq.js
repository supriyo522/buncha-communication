const amqp = require("amqplib");

async function initRabbitMQ() {
  const user = process.env.RABBITMQ_USER || "user";
  const pass = process.env.RABBITMQ_PASS || "password";

  const conn = await amqp.connect(`amqp://${user}:${pass}@rabbitmq:5672`);
  const channel = await conn.createChannel();

  await channel.assertExchange("delivery", "topic", { durable: true });

  const queue = await channel.assertQueue("delivery.sms");
  channel.bindQueue(queue.queue, "delivery", "delivery.sms");

  return { channel, queue };
}

module.exports = { initRabbitMQ };
