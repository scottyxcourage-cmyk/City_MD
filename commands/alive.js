const settings = require('../settings');
const { reply } = require('./_helper');
module.exports = async (sock, chatId, message) => {
    const up = process.uptime();
    const d=Math.floor(up/86400), h=Math.floor((up%86400)/3600), m=Math.floor((up%3600)/60), s=Math.floor(up%60);
    const ram = (process.memoryUsage().rss/1024/1024).toFixed(1);
    await reply(sock, chatId,
`🌆 *CITY_MD — STATUS REPORT*
━━━━━━━━━━━━━━━━━━━━━━
✅  Bot is *LIVE* on the streets!

⏱️  Uptime  »  ${d}d ${h}h ${m}m ${s}s
💾  RAM     »  ${ram} MB used
📦  Version »  v${settings.version}
🌐  Mode    »  ${sock.public?'🟢 Public':'🔴 Private'}
⚡  Commands »  50 ready

🏙️ _The city never sleeps._`, message);
};
