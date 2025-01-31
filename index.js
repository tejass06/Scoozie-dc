const fs = require('fs');
const { Client, GatewayIntentBits, Collection } = require('discord.js');

// Initialize bot
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

// Shared objects for cooldowns and user stats
const dropCooldowns = new Map();
const userStats = new Map();


// Command loading
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

// Message listener
client.on('messageCreate', async (message) => {
    if (message.author.bot || !message.content.startsWith('!')) return;

    const args = message.content.slice(1).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (!client.commands.has(commandName)) return;

    try {
        const command = client.commands.get(commandName);
        // Pass shared objects as context
        await command.execute(message, args, { dropCooldowns, userStats });
    } catch (error) {
        console.error(error);
        message.reply('There was an error executing that command.');
    }
});

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});


// Log in to Discord
client.login('');

