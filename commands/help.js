const settings = require('../settings');
module.exports = async (sock, chatId, message) => {
    // First, send the image at the top
    const imageUrl = 'https://i.ibb.co/Kjp2JfyY/image.jpg'; // Direct link from ImgBB
    
    await sock.sendMessage(chatId, { 
        image: { url: imageUrl },
        caption: '✨ *City MD - Your City Never Sleeps* ✨'
    }, { quoted: message });
    
    // Then send the menu text
    const menu = `
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃      _🌆 𝗖𝗜𝗧𝗬 _ 𝗠 𝗗 🌆_       
┃    _Your City Never Sleeps_       
┃  _✦ v${settings.version} ✦ 50 Commands ✦_  
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

▰▰▰▰▰▰ _🏙️ 𝗚𝗘𝗡𝗘𝗥𝗔𝗟 🏙️_ ▰▰▰
  ◈ ping
  ◈ alive
  ◈ uptime
  ◈ owner
  ◈ pair
  ◈ ai
  ◈ deepseek
  ◈ help

▰▰▰▰▰▰ _🎬 𝗠𝗘𝗗𝗜𝗔 🎬_ ▰▰▰▰
  ◈ sticker
  ◈ steal
  ◈ toimg
  ◈ vv
  ◈ getdp
  ◈ tts
  ◈ play

▰▰▰▰▰▰ _🔧 𝗧𝗢𝗢𝗟𝗦 🔧_ ▰▰▰▰
  ◈ weather
  ◈ wiki
  ◈ calc
  ◈ define
  ◈ qr
  ◈ currency
  ◈ translate
  ◈ remind
  ◈ country
  ◈ github

▰▰▰▰▰▰ _🎯 𝗙𝗨𝗡 🎯_ ▰▰▰▰▰▰
  ◈ joke
  ◈ 8ball
  ◈ roast
  ◈ ship
  ◈ fact
  ◈ quote
  ◈ truth
  ◈ dare

▰▰▰▰▰▰ _🛡️ 𝗚𝗥𝗢𝗨𝗣 𝗔𝗗𝗠𝗜𝗡 🛡️_ ▰▰
  ◈ kick
  ◈ promote
  ◈ demote
  ◈ mute
  ◈ unmute
  ◈ warn
  ◈ tagall
  ◈ hidetag
  ◈ antilink
  ◈ antibadword
  ◈ welcome
  ◈ goodbye

▰▰▰▰▰▰ _👑 𝗢𝗪𝗡𝗘𝗥 👑_ ▰▰▰▰
  ◈ mode
  ◈ ban
  ◈ bc
  ◈ restart
  ◈ grouplist

━━━━━━━━━━━━━━━━━━━━━━━━━━
     _🌆 City_MD — The City Never Sleeps 🌆_
            _Built by Scotty_
`;
    await sock.sendMessage(chatId, { text: menu }, { quoted: message });
};
