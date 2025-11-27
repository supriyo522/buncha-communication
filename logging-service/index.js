const es = require("./elastic");
const { initRabbitMQ } = require("./rabbitmq");

async function init() {
  const channel = await initRabbitMQ();
  console.log("Logging Service Ready");

  channel.consume("logs", async (msg) => {
    const log = JSON.parse(msg.content.toString());
    await es.index({
      index: "service-logs",
      document: log
    });
    channel.ack(msg);
  });
}

init();
