const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'daily',
    description: 'Gives a daily reward with a 24-hour cooldown.',

    async execute(message, args, context) {
        const { dailyCooldowns, userStats } = context; // Extract shared objects
        const userId = message.author.id;

        // Cooldown logic
        const cooldown = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
        const lastDaily = dailyCooldowns.get(userId);

        if (lastDaily && Date.now() - lastDaily < cooldown) {
            const remaining = Math.ceil((cooldown - (Date.now() - lastDaily)) / 1000 / 60 / 60); // Hours remaining
            return message.reply(`⏳ You can claim your next daily reward in **${remaining} hours**.`);
        }

        dailyCooldowns.set(userId, Date.now());

        // Reward logic
        const reward = 100; // Example reward amount

        // Update user stats
        const userData = userStats.get(userId) || { dailyClaims: 0, cardsDropped: 0, cardsGrabbed: 0, lastPlayed: 'Never', coins: 0 };
        userData.dailyClaims += 1;
        userData.coins = (userData.coins || 0) + reward;
        userData.lastPlayed = new Date(); // Save as readable date
        userStats.set(userId, userData);

        // Send reward embed
        const embed = new EmbedBuilder()
            .setTitle('🎉 Daily Reward Claimed!')
            .setDescription(`You have received **${reward} coins**!`)
            .setColor('#FFFF00')
            .setFooter({ text: 'Come back tomorrow for more rewards!' })
            .setTimestamp();

        return message.reply({ embeds: [embed] });
    },
};
