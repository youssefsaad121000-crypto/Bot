const mineflayer = require('mineflayer');

function createBot() {
  const bot = mineflayer.createBot({
    host: 'thshesh.aternos.me',
    port: 17442,
    username: 'GoodMiner',
    version: '1.21.1',
    auth: 'offline'
  });

  bot.once('login', () => {
    console.log('تم الاتصال بالسيرفر بنجاح.');
  });

  bot.once('spawn', () => {
    console.log('دَخل البوت إلى العالم بنجاح!');
    
    // إيقاف الفيزياء مؤقتاً لتجنب طرد الحركة غير الصالحة
    bot.physicsEnabled = false;

    setTimeout(() => {
      bot.physicsEnabled = true;
      console.log('تم تفعيل الفيزياء بنجاح.');
    }, 2000);
  });

  bot.on('kicked', (reason) => {
    console.log('تم طرد البوت. السبب:');
    console.dir(reason, { depth: null });
  });

  bot.on('error', (err) => {
    console.log('حدث خطأ في الاتصال:', err);
  });

  // إعادة الاتصال تلقائياً إذا انقطع الاتصال أو أُغلق السيرفر
  bot.on('end', () => {
    console.log('انقطع الاتصال بالسيرفر. إعادة الاتصال خلال 5 ثوانٍ...');
    setTimeout(createBot, 5000);
  });
}

// استدعاء الدالة لتبدأ العمل
createBot();

// إبقاء العملية شغالة بدون توقف حتى ينهيها GitHub Actions بنفسه
setInterval(() => {}, 100000);
