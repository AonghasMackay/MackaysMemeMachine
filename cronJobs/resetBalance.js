const CronJob = require('cron').CronJob;
const { users } = require('../database/dbObjects.js');
const { writeToLogs } = require('../logging/logging.js');

module.exports = {
	createResetBalanceCronJob: function() {
		const resetBalance = new CronJob(
			'0 59 23 * * *',
			function() {
				writeToLogs('INFO', 'Reset balance cron job running.');

				users.prototype.resetAllBalances();

				console.log('Reset balance cron job run.');
				writeToLogs('INFO', 'Reset balance cron job run.');
			},
			null,
			true,
			'Europe/London',
		);

		resetBalance.start();

		console.log('Reset balance cron job scheduled.');
		writeToLogs('INFO', 'Reset balance cron job scheduled.');
	},
};