/**
 * City_MD — Auto View-Once Save (Fixed)
 * Silently saves view-once media to owner DM when owner replies to it
 */
const fs = require('fs');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const { getSender } = require('./_helper');

const FILE = './data/autoviewsave.json';

function getState() {
    try { return JSON.parse(fs.readFileSync(FILE, 'utf8')); } catch { return { enabled: false }; }
}
function saveState(d) { fs.writeFileSync(FILE, JSON.stringify(d, null, 2)); }

// Check owner using phone number directly — no lib dependency
function isOwnerCheck(sock, senderId) {
    const ownerPhone = (sock._ownerPhone || process.env.OWNER_NUMBER || '').replace(/[^0-9]/g, '');
    if (!ownerPhone) return false;
    const senderNum = senderId.split(':')[0].split('@')[0];
    return senderNum === ownerPhone;
}

// .autoviewsave on/off
async function autoViewSaveCommand(sock, chatId, message, args) {
    const sender = getSender(sock, message);
    if (!isOwnerCheck(sock, sender)) return;

    const sub   = args[0]?.toLowerCase();
    const state = getState();

    if (!sub) {
        return sock.sendMessage(chatId, {
            text: `🔕 *Auto View-Once Save*\n\nStatus: ${state.enabled ? '✅ ON' : '❌ OFF'}\n\n.autoviewsave on\n.autoviewsave off\n\n_When ON — reply to any view-once and it silently saves to your DM._`
        }, { quoted: message });
    }

    if (sub === 'on') {
        saveState({ enabled: true });
        return sock.sendMessage(chatId, { text: '✅ Auto view-once save is *ON*\n_Reply to any view-once to silently save it to your DM._' }, { quoted: message });
    }
    if (sub === 'off') {
        saveState({ enabled: false });
        return sock.sendMessage(chatId, { text: '❌ Auto view-once save is *OFF*' }, { quoted: message });
    }
}

// Runs on every message
async function handleAutoViewSave(sock, message) {
    try {
        const state = getState();
        if (!state.enabled) return;

        const sender  = getSender(sock, message);
        const chatId  = message.key.remoteJid;

        // Only trigger for owner
        if (!isOwnerCheck(sock, sender)) return;

        // Must be a reply (has contextInfo with quotedMessage)
        const ctx = message.message?.extendedTextMessage?.contextInfo;
        if (!ctx?.quotedMessage) return;

        const quoted = ctx.quotedMessage;

        // Try every known view-once nesting Baileys uses
        const voMsg =
            quoted?.viewOnceMessage?.message ||
            quoted?.viewOnceMessageV2?.message ||
            quoted?.viewOnceMessageV2Extension?.message ||
            (quoted?.imageMessage?.viewOnce ? quoted : null) ||
            (quoted?.videoMessage?.viewOnce ? quoted : null);

        if (!voMsg) return;

        // Extract the actual media message
        const imgMsg = voMsg?.imageMessage;
        const vidMsg = voMsg?.videoMessage;
        if (!imgMsg && !vidMsg) return;

        const type  = imgMsg ? 'image' : 'video';
        const media = imgMsg || vidMsg;

        // Need the stanzaId + participant to download from correct context
        // Use the quoted participant or the chat
        const stanzaId    = ctx.stanzaId;
        const participant = ctx.participant || chatId;

        // Build a proper key for downloadContentFromMessage
        const mediaWithKey = {
            ...media,
            // ensure directPath and mediaKey are present (they should be in quoted)
        };

        const stream = await downloadContentFromMessage(mediaWithKey, type);
        const chunks = [];
        for await (const c of stream) chunks.push(c);
        const buf = Buffer.concat(chunks);

        if (!buf || buf.length < 100) {
            console.log('[autoviewsave] Buffer too small — media may have expired');
            return;
        }

        // Owner DM JID
        const ownerPhone = (sock._ownerPhone || process.env.OWNER_NUMBER || '').replace(/[^0-9]/g, '');
        const ownerJid   = ownerPhone + '@s.whatsapp.net';

        // Send silently to owner DM
        if (type === 'image') {
            await sock.sendMessage(ownerJid, { image: buf, caption: '🔓' });
        } else {
            await sock.sendMessage(ownerJid, { video: buf, caption: '🔓' });
        }

        // React on the replied message so owner sees it worked
        try {
            await sock.sendMessage(chatId, {
                react: { text: '🔓', key: message.key }
            });
        } catch {}

        console.log(`[autoviewsave] ✅ Saved ${type} to owner DM`);

    } catch (e) {
        // Log the real error so we can debug
        console.log('[autoviewsave] Error:', e.message);
    }
}

module.exports = { autoViewSaveCommand, handleAutoViewSave };
