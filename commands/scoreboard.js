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

async function sendScoreboard(interaction) {
	const scoreboard = await users.prototype.getScoreboard();
	let scoreboardTable = createScoreboardTemplate();

	writeToLogs('DEBUG', JSON.stringify(scoreboard, null, 4));

	const userRows = [];
	const userPromise = new Promise((resolve) => {
		let i = 0;
		scoreboard.forEach(userRecord => {
			const idToSearch = userRecord.user_id;

			//if user id is this bot then skip
			if (idToSearch !== interaction.client.user.id) {

				//get guild member based on user_id regardless of if they are cached or not
				const guildMember = interaction.guild.members.fetch(idToSearch);
				guildMember.then(function(member) {
					userRows.push([member.user.username, userRecord.score, userRecord.balance]);
					i++;

					//once all users have been added to the table then resolve the promise
					if (i === scoreboard.length) {
						resolve();
					}
				});
			} else {
				i++;

				//once all users have been added to the table then resolve the promise
				if (i === scoreboard.length) {
					resolve();
				}
			}
		});
	});

	userPromise.then(() => {
		scoreboardTable = fillScoreboardTable(scoreboardTable, userRows);

		interaction.reply(scoreboardTable);
	});
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