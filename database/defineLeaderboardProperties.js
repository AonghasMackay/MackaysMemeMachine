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
}

module.exports = { defineLeaderboardProperties };