const mineflayer = require('mineflayer');

const bot = mineflayer.createBot({
  host: 'thshesh.aternos.me',
  port: 17442,
  username: 'GoodMiner',
  version: '1.21.1',
  auth: 'offline' // تسجل كحساب مجاني/Offline
});

// عند تسجيل الدخول الأساسي
bot.once('login', () => {
  console.log('تم الاتصال بالسيرفر بنجاح.');
});

// عند رسبونة البوت داخل العالم
bot.once('spawn', () => {
  console.log('دَخل البوت إلى العالم بنجاح!');
  
  // تفعيل الفيزياء بشكل صحيح
  bot.physicsEnabled = true;

  // إضافة تأخير بسيط لمنع طرد البوت بسبب حركة غير صحيحة عند الدخول مباشرة
  setTimeout(() => {
    console.log('البوت جاهز تماماً للعمل.');
  }, 1000);
});

// التعامل مع الأخطاء والطرد
bot.on('kicked', (reason) => {
  console.log('تم طرد البوت. السبب:');
  console.dir(reason, { depth: null });
});

bot.on('error', (err) => {
  console.log('حدث خطأ في الاتصال:', err);
});

bot.on('end', () => {
  console.log('انقطع الاتصال بالسيرفر.');
});
