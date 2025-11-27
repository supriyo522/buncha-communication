const amqp = require("amqplib");

async function initRabbitMQ() {
  const rabbitHost = process.env.RABBITMQ_HOST || "127.0.0.1";
  const rabbitPort = process.env.RABBITMQ_PORT || 5672;
  const rabbitUser = process.env.RABBITMQ_USER || "user";
  const rabbitPass = process.env.RABBITMQ_PASS || "password";

  const conn = await amqp.connect(`amqp://${rabbitUser}:${rabbitPass}@${rabbitHost}:${rabbitPort}`);
  const channel = await conn.createChannel();

  await channel.assertExchange("delivery", "topic", { durable: true });
  const queue = await channel.assertQueue("delivery.email");
  await channel.bindQueue(queue.queue, "delivery", "delivery.email");

  console.log("Connected to RabbitMQ for Email Service");
  return { channel, queue };
}

module.exports = { initRabbitMQ };
