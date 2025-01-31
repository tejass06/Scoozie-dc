const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'ui',
    description: 'Displays user details including daily and card stats.',

    async execute(message, args, { userStats }) {
        const userId = message.author.id;

        // Retrieve user stats or initialize if not present
        const userData = userStats.get(userId) || {
            dailyClaims: 0,
            cardsDropped: 0,
            cardsGrabbed: 0,
            lastPlayed: 'Never',
        };

        // Format last played time
        const lastPlayed = userData.lastPlayed === 'Never'
            ? 'Never'
            : `<t:${Math.floor(userData.lastPlayed / 1000)}:F>`; // Discord timestamp

        // Embed with user details
        const embed = new EmbedBuilder()
            .setTitle(`${message.author.username}'s Stats`)
            .addFields(
                { name: 'Daily Rewards Claimed', value: `${userData.dailyClaims}`, inline: true },
                { name: 'Cards Dropped', value: `${userData.cardsDropped}`, inline: true },
                { name: 'Cards Grabbed', value: `${userData.cardsGrabbed}`, inline: true },
                { name: 'Last Played', value: `${lastPlayed}`, inline: false }
            )
            .setColor('#00FFFF')
            .setFooter({ text: 'Keep playing to increase your stats!' })
            .setTimestamp();

        message.reply({ embeds: [embed] });
    },
};
