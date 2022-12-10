'use strict';

const { SlashCommandBuilder } = require('discord.js');
const { isUserAdmin } = require('../lib/isUserAdmin.js');
const { clearLogs } = require('../logging/logging.js');

/**
 * Admin command to clear the log file.
 *
 * @param {Discord.interaction} interaction
 */
module.exports = {
	data: new SlashCommandBuilder()
		.setName('clearlogs')
		.setDescription('Clears the logs file.'),
	async execute(interaction) {
		if (!isUserAdmin(interaction.user.id)) {
			await interaction.reply('You do not have permission to use this command.');
			return false;
		}

		clearLogs();
		console.log('Logs cleared');
		await interaction.reply('Logs cleared.');
	},
};