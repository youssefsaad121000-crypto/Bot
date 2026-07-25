const mineflayer = require('mineflayer');

const PASSWORD = process.env.BOT_PASSWORD || 'Funymath057356244';
const HOST = 'cookiesmp.pro';
const PORT = 25565;
const USERNAME = 'abo3en'; // تم تغيير اسم المستخدم هنا
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

  // تتبع حالة البوت (LOBBY أو IN_SURVIVAL)
  let stage = 'LOBBY';

  bot.on('spawn', () => {
    console.log(`تم محاكاة الدخول بالحساب (${USERNAME}) - تعطيل الفيزياء لمنع الطرد`);
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
      console.log('تم تسجيل الدخول بنجاح! جاري كتابة أمر /survival لفتح القائمة...');
      await sleep(2500);

      // كتابة أمر /survival لفتح قائمة السيرفرات
      bot.chat('/survival');
    }
  });

  bot.on('windowOpen', async (window) => {
    console.log(`[GUI] تم فتح قائمة بعنوان: "${window.title}" (المرحلة الحالية: ${stage})`);
    await sleep(1200);

    // ----------------------------------------------------
    // الخطوة الأولى: القائمة التي فتحت في اللوبي عن طريق أمر /survival
    // ----------------------------------------------------
    if (stage === 'LOBBY') {
      console.log('جاري النقر على الخانة رقم 13 لدخول السرفايفل...');
      
      // النقر على الخانة رقم 13
      await bot.clickWindow(13, 0, 0);

      stage = 'ENTERING_SURVIVAL';
      console.log('تم اختيار السرفايفل! انتظار 8 ثوانٍ للتحميل وتجهيز العالم...');
      await sleep(8000);

      stage = 'IN_SURVIVAL';
      await startSurvivalSequence(bot);

    // ----------------------------------------------------
    // الخطوة الثانية: القائمة التي تفتح في السرفايفل بعد الضغط كليك يمين بالخانة 4
    // ----------------------------------------------------
    } else if (stage === 'IN_SURVIVAL') {
      console.log('تم فتح القائمة داخل سيرفر Survival بنجاح!');

      // البحث عن أول أيتم موجود بالقائمة للنقر عليه
      const itemSlot = window.slots.findIndex((item, idx) => item !== null && idx < window.inventoryStart);

      if (itemSlot !== -1) {
        console.log(`الضغط على الخانة رقم (${itemSlot}) داخل القائمة...`);
        await bot.clickWindow(itemSlot, 0, 0);
      } else {
        console.log('لم يتم العثور على أيتم محدد، جاري النقر على الخانة 0 افتراضياً...');
        await bot.clickWindow(0, 0, 0);
      }

      // انتظار ثانيتين
      console.log('انتظار 2 ثانية...');
      await sleep(2000);

      // إرسال أمر /afk
      console.log('إرسال أمر /afk...');
      bot.chat('/afk');
      console.log('تمت العملية واكتملت جميع الخطوات بنجاح!');
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

async function startSurvivalSequence(bot) {
  try {
    console.log('>>> بدء الخطوات داخل سيرفر السرفايفل <<<');
    
    // 1. الانتقال للخانة 4 في الـ Hotbar (index 3)
    console.log('1. التبديل للخانة 4 في الـ Hotbar...');
    bot.setQuickBarSlot(3);
    await sleep(1500);

    // 2. عمل كليك يمين لفتح قائمة الأيتم
    console.log('2. تنفيذ [كليك يمين] لفتح قائمة الخانة 4...');
    bot.activateItem();

  } catch (err) {
    console.log('حدث خطأ في تسلسل السرفايفل:', err.message || err);
  }
}

createBot();
 
