'use strict';

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { users } = require('../database/dbObjects.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('userinfo')
		.setDescription('Displays information about you. e.g. your balance'),
	async execute(interaction) {
		const user = await users.prototype.getUser(interaction.user.id);

		//cast user properties to string
		const userBalance = String(user.balance);
		const userScore = String(user.score);
		const userNumberOfWins = String(user.number_of_wins);
		const userSilencedBot = String(user.silenced_bot);

		const userInfoEmbed = new EmbedBuilder()
			.setColor(0x7842f5)
			.setTitle('User Info - ' + interaction.user.username)
			.addFields(
				{ name: 'Balance', value: userBalance },
				{ name: 'Current Score', value: userScore },
				{ name: 'Number of Wins', value: userNumberOfWins },
				{ name: 'Bot muted?', value: userSilencedBot },
			);

		await interaction.reply({ embeds: [userInfoEmbed] });
	},
};