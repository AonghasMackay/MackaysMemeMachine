'use strict';

/**
 * Define properties for the leaderboard model
 *
 * @param {Sequelize.model} leaderboard
 * @returns {undefined}
 */
function defineLeaderboardProperties(users) {
	Reflect.defineProperty(users.prototype, 'addScore', {
		value: async user_id => {
			const user = await users.findOne({
				where: { user_id: user_id },
			});

			if (user) {
				user.score += 1;
				return user.save();
			}

			return users.create({ user_id: user_id, score: 1, balance: 5, number_of_wins: 0, silenced_bot: false });
		},
	});
}

module.exports = { defineLeaderboardProperties };