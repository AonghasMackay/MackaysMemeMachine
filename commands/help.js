'use strict';

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { positiveEmoji, negativeEmoji } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Displays a list of commands and instructions on how to use the bot.'),
	async execute(interaction) {
		sendHelpEmbed(interaction);
	},
};

/**
 * Sends an embed with the help information
 *
 * @param {Discord.interaction} interaction
 */
async function sendHelpEmbed(interaction) {
	const helpEmbed = new EmbedBuilder()
		.setColor(0x7842f5)
		.setTitle('Mackay\'s Meme Machine V2 - Help')
		.setDescription(`Mackay's Meme Machine V2 allows users to reward and remove points from other users via the ${positiveEmoji} and ${negativeEmoji} emojis. \n\nThe user with the most points at the end of the month wins. At the end of the month everything is reset and the winner is recorded in the leaderboard. \n\nUsers have a balance of 5 points to give or take away per day.\n \n`)
		.addFields(
			{ name: 'See your user info', value: '/userinfo' },
			{ name: 'See the current scoreboard', value: '/scoreboard' },
			{ name: 'See leaderboard of all past winners', value: '/leaderboard' },
			{ name: 'Toggle bot mute for direct messages', value: '/mutebot' },
			{ name: 'Check bot is running', value: '/ping' },
		);

	await interaction.reply({ embeds: [helpEmbed] });
}