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