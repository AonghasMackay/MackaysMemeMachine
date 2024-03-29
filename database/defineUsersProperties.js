'use strict';

const { writeToLogs } = require('../logging/logging.js');

/**
 * Define properties for the users model
 *
 * @param {Sequelize.model} users
 * @returns {undefined}
 */
function defineUsersProperties(users) {
	Reflect.defineProperty(users.prototype, 'addScore', {
		value: async user_id => {
			const user = await users.findOne({
				where: { user_id: user_id },
			});

			if (user) {
				user.score += 1;
				return user.save();
			}

			return users.create({ user_id: user_id, score: 1, balance: 5, number_of_wins: 0, silenced_bot: true });
		},
	});

	Reflect.defineProperty(users.prototype, 'removeScore', {
		value: async user_id => {
			const user = await users.findOne({
				where: { user_id: user_id },
			});

			if (user) {
				user.score -= 1;
				return user.save();
			}

			return users.create({ user_id: user_id, score: -1, balance: 5, number_of_wins: 0, silenced_bot: true });
		},
	});

	Reflect.defineProperty(users.prototype, 'hasPositiveBalance', {
		value: async user_id => {
			const user = await users.findOne({
				where: { user_id: user_id },
			});

			if (user) {
				if (user.balance > 0) {
					return true;
				} else {
					return false;
				}
			}
			return users.create({ user_id: user_id, score: 0, balance: 4, number_of_wins: 0, silenced_bot: true });
		},
	});

	Reflect.defineProperty(users.prototype, 'lowerBalance', {
		value: async user_id => {
			const user = await users.findOne({
				where: { user_id: user_id },
			});

			if (user) {
				user.balance -= 1;
				return user.save();
			}

			return users.create({ user_id: user_id, score: 0, balance: 4, number_of_wins: 0, silenced_bot: true });
		},
	});

	Reflect.defineProperty(users.prototype, 'getUser', {
		value: async user_id => {
			const user = await users.findOne({
				where: { user_id: user_id },
			});

			if (user) {
				return user;
			}

			writeToLogs('ERROR', 'User not found in database');
			return false;
		},
	});


	Reflect.defineProperty(users.prototype, 'getScoreboard', {
		value: async () => {
			//order the users by score
			const usersByScore = await users.findAll({
				order: [['score', 'DESC']],
			});

			if (usersByScore) {
				return usersByScore;
			}

			return false;
		},
	});

	Reflect.defineProperty(users.prototype, 'resetAllBalances', {
		//for each user in the database, set their balance to 5
		value: async () => {
			const allUsers = await users.findAll();

			allUsers.forEach(user => {
				user.balance = 5;
				user.save();
			});

			console.log('All balances reset');
			writeToLogs('INFO', 'All balances reset');

			return;
		},
	});

	Reflect.defineProperty(users.prototype, 'muteBot', {
		//for a specific user, set their silenced_bot value to true
		value: async user_id => {
			const user = await users.findOne({
				where: { user_id: user_id },
			});

			if (user) {
				if (user.silenced_bot == false) {
					user.silenced_bot = true;
				} else {
					user.silenced_bot = false;
				}

				return user.save();
			}

			writeToLogs('ERROR', 'User not found in database');
			return false;
		},
	});

	Reflect.defineProperty(users.prototype, 'isBotMuted', {
		//Returns silenced_bot value for a specific user
		value: async user_id => {
			const user = await users.findOne({
				where: { user_id: user_id },
			});

			if (user) {
				return user.silenced_bot;
			}

			writeToLogs('ERROR', 'User not found in database');
			return false;
		},
	});

	Reflect.defineProperty(users.prototype, 'incrementNumberOfWins', {
		value: async user_id => {
			const user = await users.findOne({
				where: { user_id: user_id },
			});

			if (user) {
				user.number_of_wins += 1;
				return user.save();
			}

			writeToLogs('ERROR', 'Winners user_id not found in database');
			return false;
		},
	});

	Reflect.defineProperty(users.prototype, 'resetAllUsers', {
		//for each user in the database, set their balance to 5 and their score to 0
		value: async () => {
			const allUsers = await users.findAll();

			allUsers.forEach(user => {
				user.balance = 5;
				user.score = 0;
				user.save();
			});

			console.log('All balances reset');
			writeToLogs('INFO', 'All balances reset');

			return;
		},
	});
}

module.exports = { defineUsersProperties };