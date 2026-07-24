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
      // هنا تقدر تبدأ خطواتك بعد التأكد من الدخول
    }
  });

  bot.on('spawn', async () => {
    console.log('Spawned');
    // الأفضل تربط الخطوات برسالة تسجيل الدخول بدل sleep ثابت
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

  bot.on('kicked', (reason) => {
    // السبب ممكن يكون object، نحوله لنص
    const reasonText = typeof reason === 'string'
      ? reason
      : JSON.stringify(reason);

    console.log('Kicked:', reasonText);

    // لو السبب دائم، ما تعيدش الاتصال
    if (reasonText.toLowerCase().includes('wrong password') ||
        reasonText.toLowerCase().includes('banned')) {
      console.log('Permanent issue detected, not reconnecting.');
      return;
    }

    if (!reconnecting) {
      reconnecting = true;
      console.log('Reconnecting in 10 seconds...');
      setTimeout(() => {
        reconnecting = false;
        createBot();
      }, 10000);
    }
  });

  bot.on('error', err => {
    console.log('Error:', err);
  });

  bot.on('end', () => {
    console.log('Disconnected');
    if (!reconnecting) {
      reconnecting = true;
      console.log('Reconnecting in 10 seconds...');
      setTimeout(() => {
        reconnecting = false;
        createBot();
      }, 10000);
    }
  });
}

// تشغيل البوت أول مرة
createBot();
