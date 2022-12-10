const Sequelize = require('sequelize');
const { defineUsersProperties } = require('./defineUserProperties.js');
const { dbName, dbUsername, dbPassword, dbHost } = require('../config.json');

const sequelize = new Sequelize(dbName, dbUsername, dbPassword, {
	host: dbHost,
	dialect: 'sqlite',
	logging: false,
	storage: 'database/database.sqlite',
});

//Models must be imported after sequelize is initialized
const users = require('../models/users.js')(sequelize, Sequelize.DataTypes);
const leaderboard = require('../models/leaderboard.js')(sequelize, Sequelize.DataTypes);

//Define properties for the users model
defineUsersProperties(users);

module.exports = { users, leaderboard };