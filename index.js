const mineflayer = require('mineflayer');

const PASSWORD = process.env.BOT_PASSWORD || 'Funymath057356244';
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
    version: VERSION,
    checkFootPlacement: false // تعطيل فحص القدم لمنع أخطاء الحركة
  });

  let openedMenu = false;
  let loggedIn = false;

  bot.on('spawn', () => {
    console.log('تم تسجيل الدخول للعالم - تعطيل الفيزياء لمنع الطرد');
    // تعطيل الفيزياء تماماً لمنع إرسال movement packets مغلوطة
    bot.physicsEnabled = false; 
  });

  bot.on('messagestr', async (msg) => {
    console.log('[Server]:', msg);
    const text = msg.toLowerCase();

    if (text.includes('register')) {
      await sleep(2000);
      bot.chat(`/register ${PASSWORD} ${PASSWORD}`);
    }

    if (text.includes('login')) {
      await sleep(2000);
      bot.chat(`/login ${PASSWORD}`);
    }

    if (text.includes('successfully logged in')) {
      console.log('تم تأكيد الدخول!');
      loggedIn = true;

      await sleep(3000);
      bot.chat('/server survival');
    }
  });

  bot.on('windowOpen', async (window) => {
    if (!loggedIn || openedMenu) return;
    openedMenu = true;

    await sleep(2000);

    const grass = window.slots.find(item =>
      item && (item.name === 'grass_block' || item.name.includes('grass'))
    );

    if (grass) {
      await bot.clickWindow(grass.slot, 0, 0);
      await sleep(4000);
      bot.chat('/afk');
      console.log('تم تفعيل AFK');
    }
  });

  bot.on('kicked', (reason) => {
    console.log('تم الطرد:', typeof reason === 'string' ? reason : JSON.stringify(reason));
    handleReconnect();
  });

  bot.on('error', err => console.log('خطأ:', err.message || err));
  bot.on('end', () => handleReconnect());

  function handleReconnect() {
    if (!reconnecting) {
      reconnecting = true;
      console.log('إعادة اتصال بعد 30 ثانية...');
      setTimeout(() => {
        reconnecting = false;
        createBot();
      }, 30000);
    }
  }
}

createBot();
