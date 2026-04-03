/**
 * City_MD — Auto View-Once Save
 * Silently saves view-once media to owner DM when owner replies to it
 * No output in chat — completely silent
 */
const fs = require('fs');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const { getSender, getIsOwner } = require('./_helper');

const FILE = './data/autoviewsave.json';

function getState() {
    try { return JSON.parse(fs.readFileSync(FILE, 'utf8')); } catch { return { enabled: false }; }
}
function saveState(d) { fs.writeFileSync(FILE, JSON.stringify(d, null, 2)); }

// .autoviewsave on/off — toggle command (owner only)
async function autoViewSaveCommand(sock, chatId, message, args) {
    const sender  = getSender(sock, message);
    const isOwner = getIsOwner(sock);
    if (!await isOwner(sender, sock, chatId)) return;

    const sub = args[0]?.toLowerCase();
    const state = getState();

    if (!sub) {
        return sock.sendMessage(chatId, {
            text: `🔕 *Auto View-Once Save*\n\nStatus: ${state.enabled ? '✅ ON' : '❌ OFF'}\n\n.autoviewsave on\n.autoviewsave off\n\n_When ON — reply to any view-once and it silently saves to your DM._`
        }, { quoted: message });
    }

    if (sub === 'on')  { saveState({ enabled: true });  return sock.sendMessage(chatId, { text: '✅ Auto save ON — I\'ll silently save view-once media to your DM.' }, { quoted: message }); }
    if (sub === 'off') { saveState({ enabled: false }); return sock.sendMessage(chatId, { text: '❌ Auto save OFF.' }, { quoted: message }); }
}

// Called on every message — silently handles view-once when owner replies
async function handleAutoViewSave(sock, message) {
    try {
        const state = getState();
        if (!state.enabled) return;

        // Must be a reply from the owner
        const sender  = getSender(sock, message);
        const isOwner = getIsOwner(sock);
        const chatId  = message.key.remoteJid;
        if (!await isOwner(sender, sock, chatId)) return;

        // Check if this message is a reply
        const ctx = message.message?.extendedTextMessage?.contextInfo;
        if (!ctx?.quotedMessage) return;

        const quoted = ctx.quotedMessage;

        // Dig out the view-once media
        const voMsg =
            quoted?.viewOnceMessage?.message ||
            quoted?.viewOnceMessageV2?.message ||
            quoted?.viewOnceMessageV2Extension?.message;

        if (!voMsg) return; // not a view-once, ignore silently

        const imgMsg = voMsg?.imageMessage;
        const vidMsg = voMsg?.videoMessage;
        if (!imgMsg && !vidMsg) return;

        const type   = imgMsg ? 'image' : 'video';
        const media  = imgMsg || vidMsg;

        // Download
        const stream = await downloadContentFromMessage(media, type);
        const chunks = [];
        for await (const c of stream) chunks.push(c);
        const buf = Buffer.concat(chunks);

        // Get owner DM JID
        const ownerPhone = sock._ownerPhone || process.env.OWNER_NUMBER || '';
        const ownerJid   = ownerPhone.replace(/[^0-9]/g, '') + '@s.whatsapp.net';

        // Send silently to owner DM — no caption, no noise
        if (type === 'image') {
            await sock.sendMessage(ownerJid, { image: buf });
        } else {
            await sock.sendMessage(ownerJid, { video: buf });
        }

        // Silently react with a lock emoji so owner knows it was saved (optional, subtle)
        try {
            await sock.sendMessage(chatId, {
                react: { text: '🔓', key: message.key }
            });
        } catch {}

    } catch {} // fail silently always
}

module.exports = { autoViewSaveCommand, handleAutoViewSave };
