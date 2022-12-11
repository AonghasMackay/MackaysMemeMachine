'use strict';

const { SlashCommandBuilder } = require('discord.js');
const { leaderboard } = require('../database/dbObjects.js');
const { AsciiTable3, AlignmentEnum } = require('ascii-table3');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leaderboard')
		.setDescription('Shows the leaderboard of all past wins'),
	async execute(interaction) {
		await sendLeaderboard(interaction);
	},
};

/**
 * Sends the leaderboard to the channel the command was sent in
 *
 * @param {Discord.interaction} interaction
 */
async function sendLeaderboard(interaction) {
	const leaderboardRecords = await leaderboard.prototype.getLeaderboard();

	let leaderboardTable = createLeaderboardTemplate();

	const leaderboardRows = [];
	const leaderboardPromise = fillLeaderboardRows(leaderboardRecords, interaction, leaderboardRows);

	leaderboardPromise.then(() => {
		leaderboardTable = fillLeaderboardTable(leaderboardTable, leaderboardRows);
		interaction.reply(leaderboardTable);
	}).catch(() => {
		interaction.reply('No leaderboard exists yet.');
	});
}

/**
 * Fills the leaderboard rows ready to be inserted into the leaderboard table and then resolves the promise
 *
 * @param {object} leaderboardRecords - leaderboard records object from the database
 * @param {Discord.interaction} interaction
 * @param {Array} leaderboardRows - rows to be added to the leaderboard table
 * @returns {Promise} - resolves when all records have been added to the leaderboardRows array
 */
function fillLeaderboardRows(leaderboardRecords, interaction, leaderboardRows) {
	const recordsPromise = new Promise((resolve, reject) => {
		let i = 0;

		if (leaderboardRecords.length === 0) {
			reject();
		}

		for (const record of leaderboardRecords) {

			const winnerId = record.winner_id;
			const runnerUpId = record.runner_up_id;
			const dateString = getRecordDateString(record);

			//get guild member based on user_id regardless of if they are cached or not
			const winnerGuildMember = interaction.guild.members.fetch(winnerId);
			const runnerUpGuildMember = interaction.guild.members.fetch(runnerUpId);

			winnerGuildMember.then(function(winnerMember) {
				runnerUpGuildMember.then(function(runnerUpMember) {
					leaderboardRows.push([dateString, winnerMember.user.username, runnerUpMember.user.username ]);
					i++;

					//once all records have been added to the table then resolve the promise
					//keep this logic inside the then function so that it only checks once all records have been added
					if (i >= leaderboardRecords.length) {
						resolve();
					}
				});
			});
		}
	});

	return recordsPromise;
}

/**
 * Takes the leaderboard record date and turn it into a string with that records scoreboard start date and end date
 *
 * @param {object} record
 * @returns {String} - combined date string
 */
function getRecordDateString(record) {
	//turn record date into a string
	const dateAsString = record.date.toDateString().replace(/^\S+\s/, '');

	//get the start date of the months scoreboard and then turn it into a string
	const startDate = record.date;
	startDate.setMonth(startDate.getMonth() - 1);
	//regex to remove name of day from date string
	const startDateAsString = startDate.toDateString().replace(/^\S+\s/, '');

	//build combined date string to return
	const dateString = startDateAsString + ' - ' + dateAsString;

	return dateString;
}

/**
 * Fills the leaderboard table with the record rows and puts it in a code block
 *
 * @param {AsciiTable3} leaderboardTable - leaderboard table template
 * @param {Array} leaderboardRows
 * @returns {String}
 */
function fillLeaderboardTable(leaderboardTable, leaderboardRows) {
	leaderboardTable.addRowMatrix(leaderboardRows);
	leaderboardTable = '```\n' + leaderboardTable.toString() + '```';

	return leaderboardTable;
}

/**
 * Creates a new AsciiTable3 object with the leaderboard headings and alignment
 *
 * @returns {AsciiTable3}
 */
function createLeaderboardTemplate() {
	const leaderboardTable = new AsciiTable3('Leaderboard')
		.setHeading('Date', 'Winner', 'Runner Up')
		.setAlign(3, AlignmentEnum.CENTER);

	return leaderboardTable;
}