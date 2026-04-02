const settings = require('../settings');
const { reply } = require('./_helper');
module.exports = async (sock, chatId, message) => {
    await reply(sock, chatId,
`👑 *CITY_MD — OWNER INFO*
━━━━━━━━━━━━━━━━━━━━
🏙️  Bot Name  »  ${settings.botName}
👤  Owner     »  ${settings.botOwner}
📱  Contact   »  +${settings.ownerNumber}
📦  Version   »  v${settings.version}
━━━━━━━━━━━━━━━━━━━━
_Hit up the owner for support_`, message);
    try {
        await sock.sendMessage(chatId, { contacts: { displayName: settings.botOwner, contacts: [{ vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:${settings.botOwner}\nTEL;type=CELL;waid=${settings.ownerNumber}:+${settings.ownerNumber}\nEND:VCARD` }] } });
    } catch {}
};
