const mineflayer = require('mineflayer');

const HOST = 'thshesh.aternos.me';
const PORT = 17442;
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
    // خيار حاسم لمنع الكراش الناتج عن تنسيق الشات المعقد
    hideErrors: true 
  });

  bot.physicsEnabled = false;

  bot.once('login', () => {
    console.log('تم تسجيل الدخول بنجاح.');
  });

  bot.once('spawn', () => {
    console.log('دَخل البوت السيرفر واستقر في المكان!');
    bot.physicsEnabled = false;
  });

  // إعادة الرسبونة تلقائياً عند الموت
  bot.on('death', () => {
    console.log('مات البوت! جاري إعادة الرسبونة...');
    bot.respawn();
  });

  // التقاط الأخطاء غير المتوقعة (مثل أخطاء الشات) لمنع توقف السكريبت
  bot.on('error', (err) => {
    console.log('[تنبيه]: تم تجاوز خطأ في النظام بنجاح:', err.message);
  });

  bot.on('kicked', (reason) => {
    console.log('تم طرد البوت. السبب:', reason);
  });

  bot.on('end', () => {
    console.log('انقطع الاتصال بالسيرفر. إعادة الاتصال خلال 5 ثوانٍ...');
    setTimeout(createBot, 5000);
  });
}

// معالج عام لأخطاء Node.js لمنع الـ Workflow من الـ Crash عند حدوث أي خطأ في الشات
process.on('uncaughtException', (err) => {
  console.log('[تجاوز كراش الشات]:', err.message);
});

// تشغيل البوت
createBot();

// إبقاء العملية تعمل باستمرار على GitHub Actions
setInterval(() => {}, 100000);
