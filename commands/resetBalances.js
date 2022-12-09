const { SlashCommandBuilder } = require('discord.js');
const { adminId } = require('../config.json');
const { users } = require('../database/dbObjects.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('resetbalances')
		.setDescription('Resets all user balances'),
	async execute(interaction) {
		if (interaction.user.id === adminId) {
			users.prototype.resetAllBalances();
			console.log('Balances reset');
			await interaction.reply('Balances reset.');
		} else {
			await interaction.reply('You do not have permission to use this command.');
		}
	},
};