const mineflayer = require('mineflayer');
const util = require('util');

const HOST = 'thshesh.aternos.me';
const PORT = 17442;
const USERNAME = 'BOT_';
const VERSION = '1.21.1';
const PASSWORD = '';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

let reconnecting = false;
let started = false;

function randomLook(bot) {
  const yaw = Math.random() * Math.PI * 2;
  const pitch = (Math.random() - 0.5) * Math.PI / 2;
  bot.look(yaw, pitch, true);
}

function randomMovement(bot) {
  const states = ['forward', 'back', 'left', 'right'];
  const state = states[Math.floor(Math.random() * states.length)];

  bot.setControlState(state, true);
  setTimeout(() => bot.setControlState(state, false), 500 + Math.random() * 800);
}

function humanize(bot) {
  setInterval(() => randomLook(bot), 1500 + Math.random() * 2000);
  setInterval(() => randomMovement(bot), 3000 + Math.random() * 4000);

  const msgs = [
    "hi",
    "laggy server lol",
    "what's up",
    "ok",
    "hmm",
    "lol"
  ];

  setInterval(() => {
    bot.chat(msgs[Math.floor(Math.random() * msgs.length)]);
  }, 8000 + Math.random() * 6000);
}

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
    humanize(bot); // تشغيل السلوك البشري
  });

  bot.on('messagestr', async (message) => {
    console.log('[CHAT]', message);

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

      randomMovement(bot);

      await sleep(1500);

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
