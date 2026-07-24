const mineflayer = require('mineflayer');

const bot = mineflayer.createBot({
  host: 'cookiesmp.pro',
  port: 19132,
  username: 'eneenfox' + Math.floor(Math.random() * 100000),
  auth: 'offline',
  version: '1.21.11'
});

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

bot.on('login', () => {
  console.log('Connected!');
});

bot.on('spawn', async () => {
  console.log('Spawned.');

  // انتظار حتى يحمل السيرفر
  await sleep(3000);

  // تسجيل الحساب
  bot.chat('/register 123yyyuuu 123yyyuuu');

  console.log('Register command sent.');

  // انتظار ظهور الشمعة
  await sleep(5000);

  // اختيار الخانة الرابعة (الرابعة = index 3)
  bot.setQuickBarSlot(3);

  await sleep(500);

  // كليك يمين بالشمعة
  bot.activateItem();

  console.log('Used orange candle.');
});

// عند فتح قائمة السيرفرات
bot.on('windowOpen', async (window) => {
  console.log('Menu opened.');

  await sleep(1000);

  // البحث عن Grass Block
  const grass = window.slots.find(item =>
    item &&
    (
      item.name === 'grass_block' ||
      item.name.includes('grass')
    )
  );

  if (!grass) {
    console.log('Grass Block not found.');
    return;
  }

  console.log('Joining Survival...');

  await bot.clickWindow(grass.slot, 0, 0);

  // انتظار الدخول
  await sleep(6000);

  // تنفيذ AFK
  bot.chat('/afk');

  console.log('/afk sent.');
});

bot.on('chat', (username, message) => {
  console.log(`<${username}> ${message}`);
});

bot.on('message', (msg) => {
  console.log(msg.toAnsi());
});

bot.on('kicked', (reason) => {
  console.log('Kicked:', reason);
});

bot.on('error', (err) => {
  console.log('Error:', err);
});

bot.on('end', () => {
  console.log('Disconnected.');

  // إعادة الاتصال بعد 5 ثوانٍ
  setTimeout(() => {
    process.exit();
  }, 5000);
});

