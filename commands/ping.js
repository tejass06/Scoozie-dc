const { EmbedBuilder } = require('discord.js');
const os = require('os'); // To get system information

module.exports = {
    name: 'ping',
    description: 'Get bot uptime and system specs',

    execute(message) {
        // Calculate bot uptime
        const uptimeInSeconds = process.uptime();
        const days = Math.floor(uptimeInSeconds / (3600 * 24));
        const hours = Math.floor((uptimeInSeconds % (3600 * 24)) / 3600);
        const minutes = Math.floor((uptimeInSeconds % 3600) / 60);
        const seconds = Math.floor(uptimeInSeconds % 60);

        const uptime = `${days}d ${hours}h ${minutes}m ${seconds}s`;

        // Get system information
        const systemInfo = {
            platform: os.platform(), // e.g., 'win32', 'linux'
            arch: os.arch(), // e.g., 'x64', 'arm'
            cpus: os.cpus().length, // Number of CPU cores
            memory: (os.totalmem() / (1024 * 1024 * 1024)).toFixed(2), // Total memory in GB
        };

        // Create an embed to display the information
        const pingEmbed = new EmbedBuilder()
            .setTitle('Bot Ping & System Info')
            .addFields(
                { name: 'Uptime', value: uptime, inline: true },
                { name: 'Platform', value: systemInfo.platform, inline: true },
                { name: 'Architecture', value: systemInfo.arch, inline: true },
                { name: 'CPU Cores', value: systemInfo.cpus.toString(), inline: true },
                { name: 'Memory (GB)', value: systemInfo.memory, inline: true }
            )
            .setColor('#00FF00')
            .setFooter({ text: 'Bot is running smoothly!' });

        // Send the embed in the message
        message.reply({ embeds: [pingEmbed] });
    },
};
