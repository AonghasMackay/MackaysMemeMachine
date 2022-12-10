'use strict';

const { SlashCommandBuilder } = require('discord.js');
const { isUserAdmin } = require('../lib/isUserAdmin.js');
const { users } = require('../database/dbObjects.js');

/**
 * Admin command to reset all user balances
 *
 * @param {Discord.interaction} interaction
 */
module.exports = {
	data: new SlashCommandBuilder()
		.setName('resetbalances')
		.setDescription('Resets all user balances'),
	async execute(interaction) {
		if (!isUserAdmin(interaction.user.id)) {
			await interaction.reply('You do not have permission to use this command.');
			return false;
		}

		users.prototype.resetAllBalances();
		console.log('Balances reset');
		await interaction.reply('Balances reset.');
	},
};