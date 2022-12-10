'use strict';

/**
 * Define the leaderboard table model
 *
 * @param {Sequelize} sequelize
 * @param {Sequelize.dataTypes} DataTypes - https://sequelize.org/api/v6/variable/index.html#static-variable-DataTypes
 * @returns {Sequelize.Model} - https://sequelize.org/api/v6/class/src/model.js~model
 */
module.exports = (sequelize, DataTypes) => {
	return sequelize.define('leaderboard', {
		date: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW,
			allowNull: false,
		},
		winner_id: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		runner_up_id: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	}, {
		timestamps: false,
	});
};