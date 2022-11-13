const { SlashCommandBuilder } = require('discord.js');
const { adminId } = require('../config.json');
const { clearLogs } = require('../logging/logging.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('clearlogs')
		.setDescription('Clears the logs file.'),
	async execute(interaction) {
		if (interaction.user.id === adminId) {
			clearLogs();
			console.log('Logs cleared');
			await interaction.reply('Logs cleared.');
		} else {
			await interaction.reply('You do not have permission to use this command.');
		}
	},
};