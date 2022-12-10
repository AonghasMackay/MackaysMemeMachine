const Sequelize = require('sequelize');
const { dbName, dbUsername, dbPassword, dbHost } = require('../config.json');

/**
 * Create a connection to the database
 *
 * @returns {Sequelize}
 */
function databaseConnection() {
	const sequelize = new Sequelize(dbName, dbUsername, dbPassword, {
		host: dbHost,
		dialect: 'sqlite',
		logging: false,
		storage: 'database/database.sqlite',
	});

	return sequelize;
}

module.exports = { databaseConnection };