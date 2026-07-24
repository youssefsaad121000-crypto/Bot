const mineflayer = require('mineflayer');

const PASSWORD = 'Funymath057356244';

const bot = mineflayer.createBot({
  host: 'cookiesmp.pro',
  port: 25565,
  username: 'eneenfox',
  auth: 'offline',
  version: '1.21.1'
});

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

let openedMenu = false;
let joinedSurvival = false;

bot.on('messagestr', async (msg) => {
  console.log(msg);

  const text = msg.toLowerCase();

  if (text.includes('register')) {
    await sleep(500);
    bot.chat(`/register ${PASSWORD} ${PASSWORD}`);
  }

  if (text.includes('login')) {
    await sleep(500);
    bot.chat('/login Funymath057356244');
  }
});

bot.on('spawn', async () => {
  console.log('Spawned');

  await sleep(4000);

  // اختيار الخانة الرابعة
  bot.setQuickBarSlot(3);

  await sleep(500);

  // كليك يمين بالشمعة
  bot.activateItem();
});

bot.on('windowOpen', async (window) => {
  if (openedMenu) return;
  openedMenu = true;

  console.log('Menu opened');

  await sleep(1000);

  const grass = window.slots.find(item =>
    item &&
    (item.name === 'grass_block' ||
     item.name.includes('grass'))
  );

  if (!grass) {
    console.log('Grass Block not found');
    return;
  }

  await bot.clickWindow(grass.slot, 0, 0);

  joinedSurvival = true;

  await sleep(5000);

  bot.chat('/afk');

  console.log('AFK enabled');
});

bot.on('kicked', reason => {
  console.log('Kicked:', reason);
});

bot.on('error', err => {
  console.log(err);
});

bot.on('end', () => {
  console.log('Disconnected');
});
