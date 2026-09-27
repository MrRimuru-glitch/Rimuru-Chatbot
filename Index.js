const { Telegraf } = require('telegraf');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const bot = new Telegraf(process.env.BOT_TOKEN);
const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

bot.start((ctx) => ctx.reply(`Yo! I be Rimuru AI 🔥\n\nJust send me any message and I go reply you!\n\nCommands:\n/start - Wake me\n/ping - Check if alive`));

bot.command('ping', (ctx) => ctx.reply('🟢 Rimuru AI alive and chilling!'));

bot.on('text', async (ctx) => {
  const text = ctx.message.text;
  if(text.startsWith('/')) return;
  
  try {
    await ctx.sendChatAction('typing');
    const result = await model.generateContent(text);
    const reply = result.response.text();
    await ctx.reply(reply.slice(0, 4000)); // Telegram limit
  } catch(e) {
    console.log(e);
    ctx.reply('😵 AI choke small, try again: ' + e.message.slice(0,100));
  }
});

bot.launch().then(()=> console.log('Rimuru AI Fresh started!'));
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
