const { reply } = require('./_helper');
module.exports = async (sock, chatId, message) => {
    const up = process.uptime();
    const d=Math.floor(up/86400), h=Math.floor((up%86400)/3600), m=Math.floor((up%3600)/60), s=Math.floor(up%60);
    await reply(sock, chatId,
`🏙️ *CITY_MD — UPTIME*
━━━━━━━━━━━━━━━━━━
🕐  Running for:
    ${d} days  ${h} hrs  ${m} min  ${s} sec

🌆 _Still standing. The city endures._`, message);
};
