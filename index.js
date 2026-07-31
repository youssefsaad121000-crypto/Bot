const mineflayer = require('mineflayer');

const HOST = 'thshesh.aternos.me';
const PORT = 59137ذ;
const USERNAME = 'GoodMiner';
const VERSION = '1.21.1';

function createBot() {
  const bot = mineflayer.createBot({
    host: HOST,
    port: PORT,
    username: USERNAME,
    auth: 'offline',
    version: VERSION,
    checkTimeoutInterval: 120 * 1000,
    hideErrors: true
  });

  bot.physicsEnabled = false;

  // حظر حزم الشات فور وصولها لمنع خطأ prismarine-chat و EPIPE نهائياً
  bot._client.on('packet', (data, metadata) => {
    if (metadata.name === 'player_chat' || metadata.name === 'system_chat' || metadata.name === 'profile_less_chat') {
      metadata.name = 'ignored_chat'; // تغيير اسم الحزمة حتى لا تعالجها المكتبة
    }
  });

  bot.once('login', () => {
    console.log('تم تسجيل الدخول بنجاح.');
  });

  bot.once('spawn', () => {
    console.log('دَخل البوت السيرفر واستقر في المكان!');
    bot.physicsEnabled = false;
  });

  bot.on('death', () => {
    console.log('مات البوت! جاري إعادة الرسبونة...');
    bot.respawn();
  });

  bot.on('error', (err) => {
    // تجاهل أخطاء EPIPE والتوصيل الناتجة عن الحزم
    if (err.code === 'EPIPE') return;
    console.log('[تنبيه النظام]:', err.message);
  });

  bot.on('kicked', (reason) => {
    console.log('تم طرد البوت. السبب:', reason);
  });

  bot.on('end', () => {
    console.log('انقطع الاتصال بالسيرفر. إعادة الاتصال خلال 5 ثوانٍ...');
    setTimeout(createBot, 5000);
  });
}

// تجاوز أي كراش في السكريبت
process.on('uncaughtException', (err) => {
  if (err.code === 'EPIPE') return;
  console.log('[تم تجاوز الخطأ]:', err.message);
});

createBot();
setInterval(() => {}, 100000);


