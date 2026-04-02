const { reply } = require('./_helper');
module.exports = async (sock, chatId, message) => {
    const start = Date.now();
    await sock.sendMessage(chatId, { text: '🌆 Checking city signals...' }, { quoted: message });
    const ms = Date.now() - start;
    const bar = ms < 100 ? '🟢 Lightning Fast' : ms < 300 ? '🟡 Steady' : '🔴 Slow Lane';
    await reply(sock, chatId,
`🏙️ *CITY_MD — PING*
━━━━━━━━━━━━━━━━━
📡  Signal    »  *${ms}ms*
🚦  Status    »  ${bar}
🌆  City Bot  »  Online & Ready`, message);
};
