const mineflayer = require('mineflayer');
const util = require('util');

const HOST = 'thshesh.aternos.me';
const PORT = 17442;
const USERNAME = 'BOT_';
const VERSION = '1.21.1';

let reconnecting = false;

function createBot() {
  const bot = mineflayer.createBot({
    host: HOST,
    port: PORT,
    username: USERNAME,
    version: VERSION
  });

  console.log('Connecting...');

  bot.once('spawn', () => {
    reconnecting = false;
    console.log('Spawned.');
  });

  function reconnect() {
    if (reconnecting) return;
    reconnecting = true;

    console.log('Reconnecting in 5 seconds...');

    setTimeout(() => {
      createBot();
    }, 5000);
  }

  bot.on('kicked', (reason) => {
    console.log('Kicked:');
    console.log(util.inspect(reason, { depth: null, colors: true }));
    reconnect();
  });

  bot.on('end', () => {
    console.log('Disconnected.');
    reconnect();
  });

  bot.on('error', (err) => {
    console.log('Error:');
    console.log(err);
  });
}

createBot();
