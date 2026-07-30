const mineflayer = require('mineflayer');

const bot = mineflayer.createBot({
  host: 'thshesh.aternos.me',
  port: 17442,
  username: 'GoodMiner',
  version: '1.21.1',
  auth: 'offline' // Forces offline/cracked login
});

bot.once('login', () => {
  console.log('Logged in.');
});

bot.once('spawn', () => {
  console.log('Spawned successfully!');
});

bot.on('kicked', (reason) => {
  console.log('Kicked:', reason);
});

bot.on('error', (err) => {
  console.log('Error:', err);
});

bot.on('end', () => {
  console.log('Disconnected.');
});
