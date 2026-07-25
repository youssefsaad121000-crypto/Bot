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

  bot.on('spawn', () => {
    console.log('تم تسجيل الدخول للعالم - تعطيل الفيزياء');
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

      // بدء تنفيذ التتابع المطلوبة بعد الدخول لسيرفر السرفايفل
      await startSequence(bot);
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

async function startSequence(bot) {
  try {
    // انتظار 5 ثوانٍ لضمان الانتقال الكامل واستقرار السيرفر
    await sleep(5000);

    // 1. الانتقال للخانة رقم 4 في الـ Hotbar (في الكود index رقم 3 لأن العد يبدأ من 0)
    console.log('الانتقال للخانة 4 في الـ Hotbar...');
    bot.setQuickBarSlot(3); 
    await sleep(1000);

    // 2. عمل كليك يمين بالأيتم الموجود في الخانة 4
    console.log('تنفيذ كليك يمين...');
    bot.activateItem(); 
    await sleep(2000);

    // 3. البحث عن العنصر النادر/المطلوب في الشنطة ومسكه
    // ملاحظة: يمكنك تغيير 'nether_star' أو اسم العنصر حسب الشيء الموجود في الصورة
    const targetItem = bot.inventory.items().find(item => 
      item.name.includes('star') || item.name.includes('compass') || item.name.includes('clock')
    );

    if (targetItem) {
      console.log(`تم العثور على العنصر: ${targetItem.name}، جاري المسك...`);
      await bot.equip(targetItem, 'hand');
      await sleep(1000);

      // 4. عمل كليك يمين بالعنصر الثاني
      console.log('تنفيذ كليك يمين بالعنصر الثاني...');
      bot.activateItem();
      await sleep(2000);
    } else {
      console.log('لم يتم العثور على العنصر المطلوب في الشنطة، سيتم إكمال الخطوات...');
    }

    // 5. كتابة أمر /afk
    console.log('تفعيل وضع /afk...');
    bot.chat('/afk');

  } catch (err) {
    console.log('حدث خطأ أثناء تنفيذ التسلسل:', err.message || err);
  }
}

createBot();
