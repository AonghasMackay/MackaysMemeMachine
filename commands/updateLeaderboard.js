'use strict';

const { SlashCommandBuilder } = require('discord.js');
const { users, leaderboard } = require('../database/dbObjects.js');
const { isUserAdmin } = require('../lib/isUserAdmin.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('updateleaderboard')
		.setDescription('Admin command to update the leaderboard')
		.addStringOption(option =>
			option.setName('timestamp')
				.setDescription('The end date of the round in the format YYYY-MM-DD'))
		.addUserOption(option =>
			option.setName('winner')
				.setDescription('The user id of the winner'))
		.addUserOption(option =>
			option.setName('runner_up')
				.setDescription('The user id of the runner up')),
	async execute(interaction) {
		await updateLeaderboard(interaction);
	},
};

/**
 * Manually updates the leaderboard table with the end date, winner and runner up ids.
 *
 * @param {Discord.interaction} interaction
 */
async function updateLeaderboard(interaction) {
	if (!isUserAdmin(interaction.user.id)) {
		await interaction.reply('You do not have permission to use this command.');
		return false;
	}

	const timestamp = interaction.options.getString('timestamp');
	const winnerId = interaction.options.getUser('winner').id;
	const runnerUpId = interaction.options.getUser('runner_up').id;

	//create an empty object and store the winner and runner up ids in it
	const records = {};
	records.currentTime = new Date(timestamp);
	records.winnerId = winnerId ;
	records.runnerUpId = runnerUpId;

	//pass the object to the leaderboard model to update the leaderboard table
	leaderboard.prototype.adminUpdateLeaderboard(records);

	users.prototype.incrementNumberOfWins(winnerId);

	interaction.reply('Leaderboard updated');
}