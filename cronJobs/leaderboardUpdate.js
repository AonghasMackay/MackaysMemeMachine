'use strict';

const CronJob = require('cron').CronJob;
const { users, leaderboard } = require('../database/dbObjects.js');
const { writeToLogs } = require('../logging/logging.js');

/**
 * Creates a monthly cron job that updates the leaderboard table with the winner and runner up
 * then resets all users score and balance
 *
 * @returns {undefined}
 */
function createLeaderboardUpdateCronJob(client) {
	const resetleaderboard = new CronJob(
		'0 0 0 1 * *',
		function() {
			updateLeaderboard(client);
		},
		null,
		true,
		'Europe/London',
	);

	resetleaderboard.start();

	console.log('Reset leaderboard cron job scheduled.');
	writeToLogs('INFO', 'Reset leaderboard cron job scheduled.');
}

/**
 * Update the leaderboard table with the winner and runner up
 * then reset all users score and balance
 *
 * @param {Discord.client} client
 * @returns {undefined}
 */
async function updateLeaderboard(client) {
	writeToLogs('INFO', 'Reset leaderboard cron job running.');

	//get the usersByScore from the users table
	const scoreboard = await users.prototype.getScoreboard();
	let winner = null;
	let runnerUp = null;

	//get the highest scoring user and the runner up from the users table
	const winnerPromise = new Promise((resolve, reject) => {
		client.users.fetch(scoreboard[0].user_id).then((winnerUser) => {
			winner = winnerUser;

			client.users.fetch(scoreboard[1].user_id).then((runnerUpUser) => {
				runnerUp = runnerUpUser;
				resolve();
			});
		}).catch((err) => {
			reject(err);
		});
	});

	winnerPromise.then(() => {
		//create an empty object and store the winner and runner up ids in it
		const records = {};
		records.winnerId = winner.id;
		records.runnerUpId = runnerUp.id;

		//pass the object to the leaderboard model to update the leaderboard table
		leaderboard.prototype.updateLeaderboard(records);

		//increment the users number_of_wins by 1
		users.prototype.incrementNumberOfWins(winner.id);

		//then reset all users score and balance
		users.prototype.resetAllUsers();

		console.log('Reset leaderboard cron job run.');
		writeToLogs('INFO', 'Reset leaderboard cron job run.');
	});
}

module.exports = { createLeaderboardUpdateCronJob };