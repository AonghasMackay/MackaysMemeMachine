'use strict';

const { SlashCommandBuilder } = require('discord.js');
const { users } = require('../database/dbObjects.js');
const { writeToLogs } = require('../logging/logging.js');
const { AsciiTable3, AlignmentEnum } = require('ascii-table3');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('scoreboard')
		.setDescription('Replies with the current scoreboard.'),
	async execute(interaction) {
		await sendScoreboard(interaction);
	},
};

/**
 * Sends the scoreboard to the channel the command was sent in
 *
 * @param {Discord.interaction} interaction
 */
async function sendScoreboard(interaction) {
	const scoreboard = await users.prototype.getScoreboard();

	//ensure the scoreboard is sorted before building the table rows as the database query does not always return the data sorted in time
	const sortedScoreboardPromise = new Promise((resolve) => {
		let i = 1;
		scoreboard.sort(function compareRecords(a, b) {
			//sort seems to iterate one less time than the length of the collection so we -1 from the length to ensure the promise is resolved
			if (i >= (scoreboard.length - 1)) {
				resolve();
			}

			i++;

			if (a.score <= b.score) {
				return 1;
			}
			return -1;
		});
	});

	sortedScoreboardPromise.then(() => {
		let scoreboardTable = createScoreboardTemplate();

		writeToLogs('DEBUG', JSON.stringify(scoreboard, null, 4));

		const userRows = [];
		const userPromise = fillUserRows(scoreboard, interaction, userRows);

		userPromise.then(() => {
			scoreboardTable = fillScoreboardTable(scoreboardTable, userRows);
			interaction.reply(scoreboardTable);
		});
	});
}

/**
 * Fills the user rows ready to be inserted into the scoreboard table and then resolves the promise
 *
 * @param {object} scoreboard - usersByScore object from the database
 * @param {Discord.interaction} interaction
 * @param {Array} userRows - rows to be added to the scoreboard table
 * @returns {Promise} - resolves when all users have been added to the userRows array
 */
function fillUserRows(scoreboard, interaction, userRows) {
	const userPromise = new Promise((resolve) => {
		let i = 0;
		for (const userRecord of scoreboard) {

			const idToSearch = userRecord.user_id;
			//if user is the bot then skip them
			if (idToSearch == interaction.client.user.id) {
				//still increment i so that the promise resolves when all users have been added to the table
				i++;
				continue;
			}

			//get guild member based on user_id regardless of if they are cached or not
			const guildMember = interaction.guild.members.fetch(idToSearch);
			guildMember.then(function(member) {
				userRows.push([member.user.username, userRecord.score, userRecord.balance]);
				i++;

				//once all users have been added to the table then resolve the promise
				//keep this logic inside the then function so that it only checks once all users have been added
				if (i >= scoreboard.length) {
					resolve();
				}
			});
		}
	});

	return userPromise;
}

/**
 * Fills the scoreboard table with the user rows and puts it in a code block
 *
 * @param {AsciiTable3} scoreboardTable - scoreboard table template
 * @param {Array} userRows
 * @returns {String}
 */
function fillScoreboardTable(scoreboardTable, userRows) {
	scoreboardTable.addRowMatrix(userRows);
	scoreboardTable = '```\n' + scoreboardTable.toString() + '```';

	return scoreboardTable;
}

/**
 * Creates a new AsciiTable3 object with the scoreboard headings and alignment
 *
 * @returns {AsciiTable3}
 */
function createScoreboardTemplate() {
	const scoreboardTable = new AsciiTable3('Scoreboard')
		.setHeading('User', 'Score', 'Balance')
		.setAlign(3, AlignmentEnum.CENTER);

	return scoreboardTable;
}