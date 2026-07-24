const mineflayer = require('mineflayer');

const PASSWORD = 'Funymath057356244';
const HOST = 'cookiesmp.pro';
const PORT = 25565;
const USERNAME = 'eneenfox';
const VERSION = '1.21.1';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function createBot() {
  const bot = mineflayer.createBot({
    host: HOST,
    port: PORT,
    username: USERNAME,
    auth: 'offline',
    version: VERSION
  });

  let openedMenu = false;

  bot.on('messagestr', async (msg) => {
    console.log(msg);
    const text = msg.toLowerCase();

    if (text.includes('register')) {
      await sleep(500);
      bot.chat(`/register ${PASSWORD} ${PASSWORD}`);
    }

    if (text.includes('login')) {
      await sleep(500);
      bot.chat(`/login ${PASSWORD}`);
    }
  });

  bot.on('spawn', async () => {
    console.log('Spawned');

    await sleep(4000);

    // اختيار الخانة الرابعة
    bot.setQuickBarSlot(3);

    await sleep(500);

    // كليك يمين بالشمعة
    bot.activateItem();
  });

  bot.on('windowOpen', async (window) => {
    if (openedMenu) return;
    openedMenu = true;

    console.log('Menu opened');

    await sleep(1000);

    const grass = window.slots.find(item =>
      item &&
      (item.name === 'grass_block' || item.name.includes('grass'))
    );

    if (!grass) {
      console.log('Grass Block not found');
      return;
    }

    await bot.clickWindow(grass.slot, 0, 0);

    await sleep(5000);

    bot.chat('/afk');
    console.log('AFK enabled');
  });

  bot.on('kicked', reason => {
    console.log('Kicked:', reason);
  });

  bot.on('error', err => {
    console.log('Error:', err);
  });

  bot.on('end', () => {
    console.log('Disconnected... reconnecting in 5 seconds');
    setTimeout(createBot, 5000);
  });
}

// تشغيل البوت أول مرة
createBot();
