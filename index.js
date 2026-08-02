const mineflayer = require('mineflayer');

// إعدادات السيرفر
const CONFIG = {
  host: 'thshesh.falix.me',
  port: 49059,
  username: 'GoodMiner',
  version: '1.21.1',
  auth: 'offline',
  checkTimeoutInterval: 120 * 1000,
  hideErrors: true,
  // إيقاف ميزة الشات لمنع كراش الحزم بالكامل
  chatLengthLimit: 0,
  chat: 'disabled'
};

function createBot() {
  const bot = mineflayer.createBot(CONFIG);

  bot.once('login', () => {
    console.log('تم تسجيل الدخول بنجاح.');
  });

  bot.once('spawn', () => {
    console.log('دخل البوت السيرفر واستقر في المكان!');
    bot.physicsEnabled = false;

    // قفزة خفيفة كل 3 دقائق لمنع الطرد بسبب الـ AFK
    setInterval(() => {
      if (bot && bot.entity) {
        bot.setControlState('jump', true);
        setTimeout(() => bot.setControlState('jump', false), 500);
      }
    }, 180000);
  });

  bot.on('death', () => {
    console.log('مات البوت! جاري إعادة الرسبونة...');
    bot.respawn();
  });

  bot.on('error', (err) => {
    // تجاهل أخطاء الانقطاع الشائعة
    if (err.code === 'EPIPE' || err.code === 'ECONNRESET') return;
    console.log('[تنبيه النظام]:', err.message);
  });

  bot.on('kicked', (reason) => {
    console.log('تم طرد البوت. السبب:', reason);
  });

  bot.on('end', () => {
    console.log('انقطع الاتصال بالسيرفر. إعادة الاتصال خلال 10 ثوانٍ...');
    setTimeout(createBot, 10000);
  });
}

// تجاوز الأخطاء غير المتوقعة
process.on('uncaughtException', (err) => {
  if (err.code === 'EPIPE' || err.code === 'ECONNRESET') return;
  console.log('[تم تجاوز الخطأ]:', err.message);
});

createBot();
