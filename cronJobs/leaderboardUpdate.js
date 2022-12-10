'use strict';

const CronJob = require('cron').CronJob;
const { users } = require('../database/dbObjects.js');
const { writeToLogs } = require('../logging/logging.js');

module.exports = {
	createLeaderboardUpdateCronJob: function(client) {
		const resetleaderboard = new CronJob(
			'0 0 0 1 * *',
			function() {
				writeToLogs('INFO', 'Reset leaderboard cron job running.');

				//might be best to break this out into a seperate function in the file

				// get the highest scoring user in the users table and set them as the winner for the month in the leaderboard table
				const scoreboard = users.prototype.getScoreboard();
				const winner = client.users.fetch(scoreboard[0].user_id);
				const runnerUp = client.users.fetch(scoreboard[1].user_id);

				// get the second highest scoring user in the users table and set them as the runner up for the month in the leaderboard table
				// then increment the users number_of_wins by 1
				// then reset all users score and balance

				console.log('Reset leaderboard cron job run.');
				writeToLogs('INFO', 'Reset leaderboard cron job run.');
			},
			null,
			true,
			'Europe/London',
		);

		resetleaderboard.start();

		console.log('Reset leaderboard cron job scheduled.');
		writeToLogs('INFO', 'Reset leaderboard cron job scheduled.');
	},
};