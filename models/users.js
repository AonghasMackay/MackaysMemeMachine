'use strict';

/**
 * Define the users table model
 *
 * @param {Sequelize} sequelize
 * @param {Sequelize.dataTypes} DataTypes - https://sequelize.org/api/v6/variable/index.html#static-variable-DataTypes
 * @returns {Sequelize.Model} - https://sequelize.org/api/v6/class/src/model.js~model
 */
module.exports = (sequelize, DataTypes) => {
	return sequelize.define('users', {
		user_id: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
		score: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
		balance: {
			type: DataTypes.INTEGER,
			defaultValue: 5,
			allowNull: false,
		},
		number_of_wins: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
		silenced_bot: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
			allowNull: false,
		},
	}, {
		timestamps: false,
	});
};