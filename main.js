/**
 * City_MD — Main Message Handler
 * Built by Scotty | 50 Commands
 * Owner: 263788114185
 */
const fs      = require('fs');
const path    = require('path');
const settings = require('./settings');
const { isBanned }    = require('./lib/isBanned');
const { getSender }   = require('./lib/getSender');
const { makeIsOwner } = require('./lib/isOwner');
const { getMode }     = require('./commands/mode');

// Temp dir
const tempDir = path.join(process.cwd(), 'temp');
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
process.env.TMPDIR = tempDir; process.env.TEMP = tempDir; process.env.TMP = tempDir;

// ── Command imports ───────────────────────────────────────────────────────
// GENERAL
const helpCmd       = require('./commands/help');
const pingCmd       = require('./commands/ping');
const aliveCmd      = require('./commands/alive');
const uptimeCmd     = require('./commands/uptime');
const ownerCmd      = require('./commands/owner');
const pairCmd       = require('./commands/pair');
const aiCmd         = require('./commands/ai');
const deepseekCmd   = require('./commands/deepseek');

// MEDIA
const stickerCmd    = require('./commands/sticker');
const stealCmd      = require('./commands/steal');
const toimgCmd      = require('./commands/toimg');
const vvCmd         = require('./commands/vv');
const getDpCmd      = require('./commands/getdp');
const ttsCmd        = require('./commands/tts');
const playCmd       = require('./commands/play');

// TOOLS
const weatherCmd    = require('./commands/weather');
const wikiCmd       = require('./commands/wiki');
const calcCmd       = require('./commands/calc');
const defineCmd     = require('./commands/define');
const qrCmd         = require('./commands/qr');
const currencyCmd   = require('./commands/currency');
const trCmd         = require('./commands/translate');
const remindCmd     = require('./commands/remind');
const countryCmd    = require('./commands/country');
const githubCmd     = require('./commands/github');

// FUN
const jokeCmd       = require('./commands/joke');
const eightballCmd  = require('./commands/eightball');
const roastCmd      = require('./commands/roast');
const shipCmd       = require('./commands/ship');
const factCmd       = require('./commands/fact');
const quoteCmd      = require('./commands/quote');
const truthCmd      = require('./commands/truth');
const dareCmd       = require('./commands/dare');

// GROUP ADMIN
const kickCmd       = require('./commands/kick');
const promoteCmd    = require('./commands/promote');
const demoteCmd     = require('./commands/demote');
const muteCmd       = require('./commands/mute');
const unmuteCmd     = require('./commands/unmute');
const warnCmd       = require('./commands/warn');
const tagallCmd     = require('./commands/tagall');
const hidetagCmd    = require('./commands/hidetag');
const { antilinkCommand, handleLink }       = require('./commands/antilink');
const { antibadwordCommand, handleBadword } = require('./commands/antibadword');
const { welcomeCommand, handleJoin }        = require('./commands/welcome');
const { goodbyeCommand, handleLeave }       = require('./commands/goodbye');

// OWNER
const { modeCommand }           = require('./commands/mode');
const banCmd                    = require('./commands/ban');
const { bcCommand, addUser }    = require('./commands/bc');
const restartCmd                = require('./commands/restart');
const grouplistCmd              = require('./commands/grouplist');

// ── Message Handler ───────────────────────────────────────────────────────
async function handleMessages(sock, update) {
    try {
        const { messages, type } = update;
        if (type !== 'notify') return;
        const message = messages[0];
        if (!message?.message) return;
        if (Object.keys(message.message)[0] === 'ephemeralMessage')
            message.message = message.message.ephemeralMessage.message;

        const chatId   = message.key.remoteJid;
        const isGroup  = chatId?.endsWith('@g.us');
        const senderId = getSender(sock, message);

        if (!chatId || !senderId) return;
        if (chatId === 'status@broadcast') return;
        if (isBanned(senderId)) return;

        const isOwnerFn = makeIsOwner(sock._ownerPhone || '');

        // Private mode
        if (getMode().mode === 'private' && !message.key.fromMe && !await isOwnerFn(senderId, sock, chatId)) return;

        if (!isGroup) addUser(senderId);

        // Group auto-moderation
        if (isGroup) {
            await handleLink(sock, chatId, message);
            await handleBadword(sock, chatId, message);
        }

        const rawText =
            message.message?.conversation ||
            message.message?.extendedTextMessage?.text ||
            message.message?.imageMessage?.caption ||
            message.message?.videoMessage?.caption || '';

        const prefix = settings.prefix || '.';
        if (!rawText.trim().startsWith(prefix)) return;

        const [cmd] = rawText.trim().slice(prefix.length).toLowerCase().split(/\s+/);
        const args  = rawText.trim().slice(prefix.length).split(/\s+/).slice(1);

        switch (cmd) {
            // GENERAL
            case 'help': case 'menu':        await helpCmd(sock, chatId, message); break;
            case 'ping':                     await pingCmd(sock, chatId, message); break;
            case 'alive':                    await aliveCmd(sock, chatId, message); break;
            case 'uptime':                   await uptimeCmd(sock, chatId, message); break;
            case 'owner':                    await ownerCmd(sock, chatId, message); break;
            case 'pair':                     await pairCmd(sock, chatId, message, args); break;
            case 'ai': case 'ask': case 'gpt': await aiCmd(sock, chatId, message, args); break;
            case 'deepseek':                 await deepseekCmd(sock, chatId, message, args); break;

            // MEDIA
            case 'sticker': case 's':        await stickerCmd(sock, chatId, message); break;
            case 'steal':                    await stealCmd(sock, chatId, message, args); break;
            case 'toimg':                    await toimgCmd(sock, chatId, message); break;
            case 'vv': case 'viewonce':      await vvCmd(sock, chatId, message); break;
            case 'getdp': case 'dp':         await getDpCmd(sock, chatId, message); break;
            case 'tts':                      await ttsCmd(sock, chatId, message, args); break;
            case 'play':                     await playCmd(sock, chatId, message, args); break;

            // TOOLS
            case 'weather':                  await weatherCmd(sock, chatId, message, args); break;
            case 'wiki': case 'wikipedia':   await wikiCmd(sock, chatId, message, args); break;
            case 'calc': case 'math':        await calcCmd(sock, chatId, message, args); break;
            case 'define': case 'dict':      await defineCmd(sock, chatId, message, args); break;
            case 'qr': case 'qrcode':        await qrCmd(sock, chatId, message, args); break;
            case 'currency': case 'convert': await currencyCmd(sock, chatId, message, args); break;
            case 'tr': case 'translate':     await trCmd(sock, chatId, message, args); break;
            case 'remind':                   await remindCmd(sock, chatId, message, args); break;
            case 'country':                  await countryCmd(sock, chatId, message, args); break;
            case 'github': case 'gh':        await githubCmd(sock, chatId, message, args); break;

            // FUN
            case 'joke': case 'jokes':       await jokeCmd(sock, chatId, message); break;
            case '8ball':                    await eightballCmd(sock, chatId, message, args); break;
            case 'roast':                    await roastCmd(sock, chatId, message); break;
            case 'ship':                     await shipCmd(sock, chatId, message); break;
            case 'fact':                     await factCmd(sock, chatId, message); break;
            case 'quote':                    await quoteCmd(sock, chatId, message); break;
            case 'truth':                    await truthCmd(sock, chatId, message); break;
            case 'dare':                     await dareCmd(sock, chatId, message); break;

            // GROUP ADMIN
            case 'kick': case 'remove':      await kickCmd(sock, chatId, message); break;
            case 'promote':                  await promoteCmd(sock, chatId, message); break;
            case 'demote':                   await demoteCmd(sock, chatId, message); break;
            case 'mute':                     await muteCmd(sock, chatId, message); break;
            case 'unmute':                   await unmuteCmd(sock, chatId, message); break;
            case 'warn':                     await warnCmd(sock, chatId, message); break;
            case 'tagall': case 'everyone':  await tagallCmd(sock, chatId, message, args); break;
            case 'hidetag': case 'ht':       await hidetagCmd(sock, chatId, message, args); break;
            case 'antilink':                 await antilinkCommand(sock, chatId, message, args); break;
            case 'antibadword': case 'abw':  await antibadwordCommand(sock, chatId, message, args); break;
            case 'welcome':                  await welcomeCommand(sock, chatId, message, args); break;
            case 'goodbye': case 'bye':      await goodbyeCommand(sock, chatId, message, args); break;

            // OWNER
            case 'mode':                     await modeCommand(sock, chatId, message, args); break;
            case 'ban':                      await banCmd(sock, chatId, message); break;
            case 'bc': case 'broadcast':     await bcCommand(sock, chatId, message, args); break;
            case 'restart':                  await restartCmd(sock, chatId, message); break;
            case 'grouplist': case 'groups': await grouplistCmd(sock, chatId, message); break;

            default: break;
        }
    } catch (e) { console.error('[City_MD] handleMessages error:', e.message); }
}

async function handleGroupParticipantUpdate(sock, update) {
    try {
        const { id, participants, action } = update;
        if (!id.endsWith('@g.us')) return;
        if (action === 'add')    await handleJoin(sock, id, participants);
        if (action === 'remove') await handleLeave(sock, id, participants);
    } catch (e) { console.error('[City_MD] group update error:', e.message); }
}

module.exports = { handleMessages, handleGroupParticipantUpdate };
