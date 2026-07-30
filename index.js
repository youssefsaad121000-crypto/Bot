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
    checkTimeoutInterval: 60 * 1000
  });

  // إيقاف الفيزياء لتجنب أي مشاكل حركة عند الدخول
  bot.physicsEnabled = false;

  bot.once('login', () => {
    console.log('تم الاتصال بالسيرفر بنجاح.');
  });

  bot.once('spawn', () => {
    console.log('دَخل البوت إلى العالم وهو جاهز الآن!');
    bot.physicsEnabled = false;
  });

  // طباعة الرسائل في الكونسول فقط بدون إرسال أوامر تلقائية تسبب الطرد
  bot.on('messagestr', (msg) => {
    console.log('[CHAT]:', msg);
  });

  bot.on('kicked', (reason) => {
    console.log('تم طرد البوت. السبب:', reason);
  });

  bot.on('error', (err) => {
    console.log('حدث خطأ:', err);
  });

  bot.on('end', () => {
    console.log('انقطع الاتصال بالسيرفر. إعادة الاتصال خلال 5 ثوانٍ...');
    setTimeout(createBot, 5000);
  });
}

// تشغيل البوت
createBot();

// إبقاء العملية تعمل باستمرار على GitHub Actions
setInterval(() => {}, 100000);
 
