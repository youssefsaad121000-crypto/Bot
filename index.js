const mineflayer = require('mineflayer');
const util = require('util');

const HOST = 'zetrex.net';
const PORT = 25565;
const USERNAME = 'eneenfox';
const VERSION = '1.21.1';
const PASSWORD = 'Funymath057356244';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

let reconnecting = false;
let started = false;

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
    started = false;
    console.log('Spawned. Waiting for verification...');
  });

  bot.on('messagestr', async (message) => {
    console.log('[CHAT]', message);

    // غيّر هذه الرسائل لتطابق رسالة النجاح في سيرفرك
    if (
      !started &&
      (
        message.includes('Successfully verified') ||
        message.includes('Verification complete') ||
        message.includes('Successfully logged in')
      )
    ) {
      started = true;

      console.log('Verification completed.');

      await sleep(1000);
      bot.chat(`/login ${PASSWORD}`);

      await sleep(3000);

      bot.setControlState('forward', true);
      await sleep(2000);
      bot.setControlState('forward', false);

      await sleep(1000);

      bot.chat('/warp afk');
    }
  });

  function reconnect() {
    if (reconnecting) return;
    reconnecting = true;

    console.log('Reconnecting in 5 seconds...');
    setTimeout(createBot, 5000);
  }

  bot.on('kicked', (reason) => {
    console.log(util.inspect(reason, { depth: null, colors: false }));
    reconnect();
  });

  bot.on('end', reconnect);

  bot.on('error', (err) => {
    console.log(err);
  });
}

createBot();
