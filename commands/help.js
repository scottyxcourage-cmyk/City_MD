const settings = require('../settings');
module.exports = async (sock, chatId, message) => {
    const menu = `
🌆 ╔══════════════════════════╗
🌆 ║       𝗖𝗜𝗧𝗬 _ 𝗠 𝗗        ║
🌆 ║   Your City Never Sleeps  ║
🌆 ║  v${settings.version} | 50 Commands  ║
🌆 ╚══════════════════════════╝

🏙️ ▸▸ 𝗚𝗘𝗡𝗘𝗥𝗔𝗟 ◂◂ 🏙️
  ◈ ping       ◈ alive
  ◈ uptime     ◈ owner
  ◈ pair       ◈ ai
  ◈ deepseek   ◈ help

🎬 ▸▸ 𝗠𝗘𝗗𝗜𝗔 ◂◂ 🎬
  ◈ sticker    ◈ steal
  ◈ toimg      ◈ vv
  ◈ getdp      ◈ tts
  ◈ play

🔧 ▸▸ 𝗧𝗢𝗢𝗟𝗦 ◂◂ 🔧
  ◈ weather    ◈ wiki
  ◈ calc       ◈ define
  ◈ qr         ◈ currency
  ◈ translate  ◈ remind
  ◈ country    ◈ github

🎯 ▸▸ 𝗙𝗨𝗡 ◂◂ 🎯
  ◈ joke       ◈ 8ball
  ◈ roast      ◈ ship
  ◈ fact       ◈ quote
  ◈ truth      ◈ dare

🛡️ ▸▸ 𝗚𝗥𝗢𝗨𝗣 𝗔𝗗𝗠𝗜𝗡 ◂◂ 🛡️
  ◈ kick       ◈ promote
  ◈ demote     ◈ mute
  ◈ unmute     ◈ warn
  ◈ tagall     ◈ hidetag
  ◈ antilink   ◈ antibadword
  ◈ welcome    ◈ goodbye

👑 ▸▸ 𝗢𝗪𝗡𝗘𝗥 ◂◂ 👑
  ◈ mode       ◈ ban
  ◈ bc         ◈ restart
  ◈ grouplist

━━━━━━━━━━━━━━━━━━━━━━━━━━
🌆 _City_MD — The City Never Sleeps_ 🌆
_Built by Scotty_`;
    await sock.sendMessage(chatId, { text: menu }, { quoted: message });
};
