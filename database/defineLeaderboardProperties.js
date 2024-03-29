'use strict';

/**
 * Define properties for the leaderboard model
 *
 * @param {Sequelize.model} leaderboard
 * @returns {undefined}
 */
function defineLeaderboardProperties(leaderboard) {
	Reflect.defineProperty(leaderboard.prototype, 'updateLeaderboard', {
		value: async records => {
			const currentTime = new Date();

			return leaderboard.create({ date: currentTime, winner_id: records.winnerId, runner_up_id: records.runnerUpId });
		},
	});

	Reflect.defineProperty(leaderboard.prototype, 'adminUpdateLeaderboard', {
		value: async records => {
			return leaderboard.create({ date: records.currentTime, winner_id: records.winnerId, runner_up_id: records.runnerUpId });
		},
	});

	Reflect.defineProperty(leaderboard.prototype, 'getLeaderboard', {
		value: async () => {
			const leaderboardRecords = await leaderboard.findAll();

			if (leaderboardRecords) {
				return leaderboardRecords;
			}

			return false;
		},
	});
}

module.exports = { defineLeaderboardProperties };