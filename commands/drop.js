const { EmbedBuilder } = require('discord.js');
const cards = require('../data/cards.json');

module.exports = {
    name: 'drop',
    description: 'Drops a card with a cooldown of 8 minutes',

    async execute(message, args, context) {
        const { dropCooldowns, userStats } = context; // Extract shared objects
        const userId = message.author.id;

        // Cooldown logic
        const cooldown = 8 * 60 * 1000; // 8 minutes in milliseconds
        const lastDrop = dropCooldowns.get(userId);

        if (lastDrop && Date.now() - lastDrop < cooldown) {
            const remaining = Math.ceil((cooldown - (Date.now() - lastDrop)) / 1000 / 60);
            return message.reply(`You can drop a card again in ${remaining} minutes.`);
        }

        dropCooldowns.set(userId, Date.now());

        // Select a random card
        const card = cards[Math.floor(Math.random() * cards.length)];

        // Initial hidden card embed
        const hiddenEmbed = new EmbedBuilder()
            .setTitle('A card has been dropped!')
            .setDescription('Details will be revealed in 5 seconds...')
            .setImage('https://cdn.discordapp.com/attachments/1330498162229641271/1330539137874268202/card20back20black.png') // Replace with card back URL
            .setColor('#000000');

        const revealEmbed = new EmbedBuilder()
            .setTitle(`You got the card: ${card.name}`)
            .setDescription(`Series: ${card.series}\nCard Number: ${card.number}`)
            .setImage(card.image)
            .setColor('#00FF00')
            .setFooter({ text: 'Card successfully added to your collection.' });

        // Send hidden embed and reveal after 5 seconds
        const reply = await message.reply({ embeds: [hiddenEmbed] });
        setTimeout(() => {
            reply.edit({ embeds: [revealEmbed] });
        }, 5000);

        // Update user stats
        const userData = userStats.get(userId) || { dailyClaims: 0, cardsDropped: 0, cardsGrabbed: 0, lastPlayed: 'Never' };
        userData.cardsDropped += 1;
        userData.lastPlayed = new Date();
        userStats.set(userId, userData);
    },
};
