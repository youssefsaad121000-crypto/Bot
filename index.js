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
    checkFootPlacement: false
  });

  let loggedIn = false;
  let sequenceStarted = false;

  bot.on('spawn', () => {
    console.log('تم تسجيل الدخول للعالم - تعطيل الفيزياء لمنع الطرد');
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

    if (text.includes('successfully logged in') && !sequenceStarted) {
      console.log('تم تأكيد التسجيل بنجاح!');
      loggedIn = true;
      sequenceStarted = true;

      // انتظار 3 ثوانٍ ثم الانتقال لسيرفر السرفايفل
      await sleep(3000);
      bot.chat('/server survival');

      // البدء في تنفيذ تسلسل الخطوات
      await runCustomSequence(bot);
    }
  });

  // التعامل مع فتح القوائم (GUI Windows)
  bot.on('windowOpen', async (window) => {
    console.log(`تم فتح قائمة GUI بعنوان: "${window.title}"`);
    await sleep(1000);

    // البحث عن أول عنصر قابل للنقر داخل القائمة (تجاهل الخانات الفارغة)
    const validItem = window.slots.find((item, index) => item !== null && index < window.inventoryStart);

    if (validItem) {
      console.log(`جاري الضغط على العنصر: ${validItem.name} في الخانة رقم ${validItem.slot}...`);
      await bot.clickWindow(validItem.slot, 0, 0);

      // انتظار ثانتين بعد النقر كما طلبت
      console.log('انتظار 2 ثانية...');
      await sleep(2000);

      // إرسال أمر /afk
      console.log('إرسال أمر /afk...');
      bot.chat('/afk');
      console.log('تمت العملية بنجاح ووضع البوت في حالة AFK!');
    } else {
      console.log('لم يتم العثور على أي عنصر داخل القائمة للنقر عليه.');
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
      console.log('إعادة الاتصال خلال 30 ثانية...');
      setTimeout(() => {
        reconnecting = false;
        createBot();
      }, 30000);
    }
  }
}

async function runCustomSequence(bot) {
  try {
    // انتظار 5 ثوانٍ لضمان التحميل الكامل لعالم السرفايفل
    await sleep(5000);

    // 1. التبديل للخانة الرابعة في الـ Hotbar
    console.log('الانتقال للخانة 4 في الـ Hotbar...');
    bot.setQuickBarSlot(3); 
    await sleep(1500);

    // 2. عمل كليك يمين لتنشيط العنصر وفتح القائمة
    console.log('تنفيذ كليك يمين لفتح القائمة...');
    bot.activateItem();

  } catch (err) {
    console.log('حدث خطأ أثناء تنفيذ تسلسل الأوامر:', err.message || err);
  }
}

createBot();
 
