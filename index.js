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
    version: VERSION
  });

  let openedMenu = false;
  let loggedIn = false;

  // إيقاف أي تحركات قديمة عند البدء
  bot.on('spawn', async () => {
    console.log('تم محاكاة الدخول للعالم');
    
    // 1. إيقاف أي مفاتيح حركة معلقة
    bot.clearControlStates();
    
    // 2. انتظر لحظة ثم اجعل البوت ينظر للأسفل لتأكيد موقعه على الأرض للسيرفر
    await sleep(500);
    try {
      await bot.look(0, -Math.PI / 4, true); // النظر للأسفل بدرجة بسيطة
    } catch (e) {
      // تجاهل الخطأ إذا تم الطرد قبل التحديق
    }
  });

  bot.on('messagestr', async (msg) => {
    console.log('[Server]:', msg);
    const text = msg.toLowerCase();

    if (text.includes('register')) {
      await sleep(1500); // زيادة المهلة لضمان استقرار البوت على الأرض
      bot.chat(`/register ${PASSWORD} ${PASSWORD}`);
    }

    if (text.includes('login')) {
      await sleep(1500);
      bot.chat(`/login ${PASSWORD}`);
    }

    if (text.includes('successfully logged in')) {
      console.log('تم تأكيد الدخول بنجاح!');
      loggedIn = true;

      await sleep(3000);
      bot.chat('/server survival');
    }
  });

  bot.on('windowOpen', async (window) => {
    if (!loggedIn || openedMenu) return;
    openedMenu = true;

    console.log('تم فتح القائمة');

    await sleep(1500);

    const grass = window.slots.find(item =>
      item && (item.name === 'grass_block' || item.name.includes('grass'))
    );

    if (!grass) {
      console.log('لم يتم العثور على Grass Block في القائمة');
      return;
    }

    await bot.clickWindow(grass.slot, 0, 0);

    await sleep(3000);
    bot.chat('/afk');
    console.log('تم تفعيل وضع AFK');
  });

  bot.on('kicked', (reason) => {
    const reasonText = typeof reason === 'string'
      ? reason
      : (reason?.text?.value || JSON.stringify(reason));

    console.log('تم الطرد:', reasonText);

    if (reasonText.toLowerCase().includes('wrong password') ||
        reasonText.toLowerCase().includes('banned')) {
      console.log('مشكلة دائمية، لن يتم إعادة الاتصال.');
      return;
    }

    handleReconnect();
  });

  bot.on('error', err => {
    console.log('خطأ:', err.message || err);
  });

  bot.on('end', () => {
    console.log('تم قطع الاتصال بالسيرفر');
    handleReconnect();
  });

  function handleReconnect() {
    if (!reconnecting) {
      reconnecting = true;
      console.log('سيتم إعادة الاتصال خلال 30 ثانية...');
      setTimeout(() => {
        reconnecting = false;
        createBot();
      }, 30000);
    }
  }
}

// تشغيل البوت
createBot();
 
