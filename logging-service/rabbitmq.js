const amqp = require("amqplib");

async function initRabbitMQ() {
  const user = process.env.RABBITMQ_USER || "user";
  const pass = process.env.RABBITMQ_PASS || "password";

  let conn;
  for (let i = 0; i < 10; i++) { 
    try {
      conn = await amqp.connect(`amqp://${user}:${pass}@rabbitmq:5672`);
      console.log("Connected to RabbitMQ");
      break;
    } catch (err) {
      console.log(`RabbitMQ not ready, retrying in 3s... (${i + 1}/10)`);
      await new Promise(r => setTimeout(r, 3000));
    }
  }

  if (!conn) throw new Error("Could not connect to RabbitMQ after retries");

  const channel = await conn.createChannel();
  await channel.assertQueue("logs");
  return channel;
}

module.exports = { initRabbitMQ };
