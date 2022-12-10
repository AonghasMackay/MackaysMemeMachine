const Sequelize = require('sequelize');
const { defineUsersProperties } = require('./defineUserProperties.js');
const { databaseConnection } = require('../lib/databaseConnection.js');

const sequelize = databaseConnection();

//Models must be imported after sequelize is initialized
const users = require('../models/users.js')(sequelize, Sequelize.DataTypes);
const leaderboard = require('../models/leaderboard.js')(sequelize, Sequelize.DataTypes);

//Define properties for the users model
defineUsersProperties(users);

module.exports = { users, leaderboard };