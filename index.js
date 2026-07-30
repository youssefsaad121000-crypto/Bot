const mineflayer = require('mineflayer');

const PASSWORD = 'Funymath057356244';
const HOST = 'thshesh.aternos.me';
const PORT = 17442;
const USERNAME = 'GoodMiner';
const VERSION = '1.21.1';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function createBot() {
  const bot = mineflayer.createBot({
    host: HOST,
    port: PORT,
    username: USERNAME,
    auth: 'offline',
    version: VERSION,
    checkTimeoutInterval: 60 * 1000
  });

  let openedMenu = false;

  // إيقاف الفيزياء لمنع طرد الحركة (invalid_player_movement)
  bot.physicsEnabled = false;

  bot.on('messagestr', async (msg) => {
    console.log(msg);
    const text = msg.toLowerCase();

    if (text.includes('register')) {  
      await sleep(1000);  
      bot.chat(`/register ${PASSWORD} ${PASSWORD}`);  
    }  

    if (text.includes('login')) {  
      await sleep(1000);  
      bot.chat(`/login ${PASSWORD}`);  
    }
  });

  bot.on('spawn', async () => {
    console.log('Spawned successfully!');

    bot.physicsEnabled = false;

    await sleep(3000);

    // اختيار الخانة الرابعة واستخدام العنصر
    bot.setQuickBarSlot(3);  
    await sleep(1000);  
    bot.activateItem();
  });

  bot.on('windowOpen', async (window) => {
    if (openedMenu) return;
    openedMenu = true;

    console.log('Menu opened');  

    await sleep(1500);  

    const grass = window.slots.find(item =>  
      item &&  
      (item.name === 'grass_block' || item.name.includes('grass'))  
    );  

    if (!grass) {  
      console.log('Grass Block not found');  
      return;  
    }  

    await bot.clickWindow(grass.slot, 0, 0);  

    await sleep(5000);  

    bot.chat('/afk');  
    console.log('AFK enabled');
  });

  bot.on('kicked', reason => {
    console.log('Kicked:', reason);
  });

  bot.on('error', err => {
    console.log('Error:', err);
  });

  bot.on('end', () => {
    console.log('Disconnected... reconnecting in 5 seconds');
    setTimeout(createBot, 5000);
  });
}

// تشغيل البوت
createBot();

// إبقاء العملية تعمل باستمرار على GitHub Actions
setInterval(() => {}, 100000);
 
