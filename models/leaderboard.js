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