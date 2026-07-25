const mineflayer = require('mineflayer');

const PASSWORD = 'Funymath057356244';
const HOST = 'cookiesmp.pro';
const PORT = 25565;
const USERNAME = 'eneenfox';
const VERSION = '1.21.1';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

let reconnecting = false;

function createBot() {
  const bot = mineflayer.createBot({
    host: HOST,
    port: PORT,
    username: USERNAME,
    auth: 'offline',
    version: VERSION
  });

  let openedMenu = false;
  let loggedIn = false;

  bot.on('messagestr', async (msg) => {
    console.log('[Server]:', msg);
    const text = msg.toLowerCase();

    if (text.includes('register')) {
      await sleep(500);
      bot.chat(`/register ${PASSWORD} ${PASSWORD}`);
    }

    if (text.includes('login')) {
      await sleep(500);
      bot.chat(`/login ${PASSWORD}`);
    }

    if (text.includes('successfully logged in')) {
      console.log('Login confirmed, now safe to continue.');
      loggedIn = true;

      // بعد تأكيد الدخول، نفذ خطواتك
      await sleep(2000);
      bot.setQuickBarSlot(3);
      await sleep(500);
      bot.activateItem();
    }
  });

  bot.on('spawn', () => {
    console.log('Spawned');
    // ما تعملش أي حركة هنا، استنى رسالة الدخول
  });

  bot.on('windowOpen', async (window) => {
    if (!loggedIn || openedMenu) return;
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

  bot.on('kicked', (reason) => {
    const reasonText = typeof reason === 'string'
      ? reason
      : (reason?.text?.value || JSON.stringify(reason));

    console.log('Kicked:', reasonText);

    if (reasonText.toLowerCase().includes('wrong password') ||
        reasonText.toLowerCase().includes('banned')) {
      console.log('Permanent issue detected, not reconnecting.');
      return;
    }

    if (!reconnecting) {
      reconnecting = true;
      console.log('Reconnecting in 30 seconds...');
      setTimeout(() => {
        reconnecting = false;
        createBot();
      }, 30000);
    }
  });

  bot.on('error', err => {
    console.log('Error:', err);
  });

  bot.on('end', () => {
    console.log('Disconnected');
    if (!reconnecting) {
      reconnecting = true;
      console.log('Reconnecting in 30 seconds...');
      setTimeout(() => {
        reconnecting = false;
        createBot();
      }, 30000);
    }
  });
}

// تشغيل البوت أول مرة
createBot();
