'use strict';

/**
 * @file Database initialization script
 *
 * Run via cli to add commands to a server
 * navigate to parent folder and then run 'node dbInit'
 */
const Sequelize = require('sequelize');
const { dbName, dbUsername, dbPassword, dbHost } = require('./config.json');

const sequelize = new Sequelize(dbName, dbUsername, dbPassword, {
	host: dbHost,
	dialect: 'sqlite',
	storage: './database/database.sqlite',
});

require('../models/users.js')(sequelize, Sequelize.DataTypes);
require('../models/leaderboard.js')(sequelize, Sequelize.DataTypes);

const force = process.argv.includes('--force') || process.argv.includes('-f');

sequelize.sync({ force }).then(async () => {
	//insert data here if needed
	console.log('Database synced');

	sequelize.close();
}).catch(console.error);