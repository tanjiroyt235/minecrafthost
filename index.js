const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const util = require('minecraft-server-util');
require('dotenv').config();
const keepAlive = require('./keep_alive');
keepAlive();

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

const serverOptions = {
  host: 'FrostyServer.aternos.me',  // Replace with your Minecraft server
  port: 32691  // Update with your server port
};

client.once('ready', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
  setInterval(() => checkServerStatus(), 60000);
});

client.on('messageCreate', async (message) => {
  if (message.content === '!mcstatus') {
    await checkServerStatus(message);
  }
});

async function checkServerStatus(message) {
  try {
    const response = await util.status(serverOptions.host, serverOptions.port);
    const playerList = response.players.sample?.map(p => p.name).join(', ') || 'None';

    const embed = new EmbedBuilder()
      .setTitle('🟢 Server Online')
      .setColor(0x00ff00)
      .addFields(
        { name: 'Players', value: `${response.players.online}/${response.players.max}`, inline: true },
        { name: 'Version', value: response.version.name, inline: true },
        { name: 'IP:Port', value: `${serverOptions.host}:${serverOptions.port}`, inline: true },
        { name: 'Players Online', value: playerList }
      );

    message?.channel.send({ embeds: [embed] });
    client.user.setActivity(`${response.players.online} playing`, { type: 'PLAYING' });
  } catch (err) {
    console.error(err);
    const embed = new EmbedBuilder()
      .setTitle('🔴 Server Offline')
      .setColor(0xff0000)
      .setDescription('Could not reach the server.');

    message?.channel.send({ embeds: [embed] });
    client.user.setActivity('Server Offline', { type: 'PLAYING' });
  }
}

client.login(process.env.DISCORD_TOKEN);

