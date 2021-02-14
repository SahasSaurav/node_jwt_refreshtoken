const redis = require("redis");
const dotenv=require('dotenv')

dotenv.config()

const client = redis.createClient({
  host: process.env.REDIS_URI,
  port: process.env.REDIS_PORT,
});

client.auth(process.env.REDIS_PASSWORD, function (err, response) {
  if (err) {
    throw err;
  }
});

client.on("connect", () => {
  console.log("Client connected to redis...");
});

client.on("ready", () => {
  console.log("Client connected to redis and ready to use...");
});

client.on("error", (err) => {
  console.error(err.message);
});

client.on("end", () => {
  console.log("Client disconnected from user");
});

process.on("SIGINT", () => {
  client.quit();
});

module.exports = client;
