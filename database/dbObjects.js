'use strict';

const Sequelize = require('sequelize');
const { defineUsersProperties } = require('./defineUsersProperties.js');
const { databaseConnection } = require('../lib/databaseConnection.js');
const { defineLeaderboardProperties } = require('./defineLeaderboardProperties.js');

const sequelize = databaseConnection();

//Models must be imported after sequelize is initialized
//https://sequelize.org/api/v6/class/src/model.js~model
const users = require('../models/users.js')(sequelize, Sequelize.DataTypes);
const leaderboard = require('../models/leaderboard.js')(sequelize, Sequelize.DataTypes);

//Define properties for the users model
defineUsersProperties(users);
//Define properties for the leaderboard model
defineLeaderboardProperties(leaderboard);

module.exports = { users, leaderboard };