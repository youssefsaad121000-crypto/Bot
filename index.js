const mineflayer = require('mineflayer');

const HOST = 'zetrex.net';
const PORT = 25565;
const USERNAME = 'eneenfox';
const VERSION = '1.21.1';
const PASSWORD = 'Funymath057356244';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

let reconnecting = false;

function createBot() {
  const bot = mineflayer.createBot({
    host: HOST,
    port: PORT,
    username: USERNAME,
    version: VERSION
  });

  bot.once('spawn', async () => {
    reconnecting = false;

    try {
      console.log('Spawned.');

      await sleep(3000);

      bot.chat(`/login ${PASSWORD}`);

      await sleep(4000);

      bot.setControlState('forward', true);
      await sleep(2000); // عدّل الوقت إذا أردت المشي لمسافة مختلفة
      bot.setControlState('forward', false);

      await sleep(1000);

      bot.chat('/warp afk');

      console.log('Done.');
    } catch (err) {
      console.error(err);
    }
  });

  function reconnect() {
    if (reconnecting) return;
    reconnecting = true;

    console.log('Reconnecting in 5 seconds...');
    setTimeout(createBot, 5000);
  }

  bot.on('end', reconnect);

  bot.on('kicked', (reason) => {
    console.log('Kicked:', reason);
    reconnect();
  });

  bot.on('error', (err) => {
    console.log('Error:', err.message);
  });
}

createBot();
