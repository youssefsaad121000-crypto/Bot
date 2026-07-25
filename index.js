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

  let inSurvival = false;

  bot.on('spawn', () => {
    console.log('تم محاكاة الدخول - تعطيل الفيزياء');
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
      console.log('تم تسجيل الدخول بنجاح! جاري فتح قائمة السيرفرات...');
      await sleep(2500);

      // محاولة إرسال الأمر مباشرة
      bot.chat('/server survival');
      
      // كليك يمين بالأيتم في الخانة الأولى كخطة احتياطية لفتح GUI السيرفرات
      bot.setQuickBarSlot(0);
      await sleep(500);
      bot.activateItem();
    }
  });

  bot.on('windowOpen', async (window) => {
    console.log(`تم فتح نافذة: "${window.title}"`);
    await sleep(1500);

    if (!inSurvival) {
      // 1. نحن في اللوبي وقائمة السيرفرات مفتوحة
      // البحث عن أي عنصر يحتوي على اسم grass أو survival
      let targetSlot = window.slots.find(item => 
        item && (
          item.name.includes('grass') || 
          (item.customName && item.customName.toLowerCase().includes('survival'))
        )
      );

      // إذا لم يجده بالاسم، النقر على الخانة رقم 13 الموضحة بالصورة
      const slotIndex = targetSlot ? targetSlot.slot : 13;

      console.log(`جاري النقر على خيار Survival في الخانة (${slotIndex})...`);
      await bot.clickWindow(slotIndex, 0, 0);

      inSurvival = true;

      // انتظار 6 ثوانٍ للانتقال التام لسيرفر السرفايفل
      await sleep(6000);
      await runSurvivalSequence(bot);

    } else {
      // 2. نحن في السرفايفل وقائمة العنصر فتحت
      console.log('تم فتح القائمة داخل السرفايفل!');

      // النقر على أول عنصر موجود في القائمة
      const firstItemSlot = window.slots.findIndex((item, idx) => item !== null && idx < window.inventoryStart);

      if (firstItemSlot !== -1) {
        console.log(`النقر على العنصر في الخانة ${firstItemSlot}...`);
        await bot.clickWindow(firstItemSlot, 0, 0);

        // انتظار ثانيتين
        console.log('انتظار 2 ثانية...');
        await sleep(2000);

        // كتابة /afk
        console.log('إرسال /afk...');
        bot.chat('/afk');
        console.log('تمت العملية بنجاح بالكامل!');
      }
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

async function runSurvivalSequence(bot) {
  try {
    console.log('بدء التسلسل داخل السرفايفل...');
    
    // التبديل للخانة 4 في الـ Hotbar (رقم 3 برمجياً)
    console.log('الانتقال للخانة 4 في الـ Hotbar...');
    bot.setQuickBarSlot(3);
    await sleep(1500);

    // كليك يمين لفتح القائمة
    console.log('تنفيذ كليك يمين...');
    bot.activateItem();

  } catch (err) {
    console.log('خطأ أثناء تنفيذ تسلسل السرفايفل:', err.message || err);
  }
}

createBot();
