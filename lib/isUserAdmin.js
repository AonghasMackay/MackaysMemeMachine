'use strict';

const { adminId } = require('../config.json');

/**
 * Checks if the user is the admin
 *
 * @param {Discord.snowflake} idToCheck
 * @returns {boolean}
 */
function isUserAdmin(idToCheck) {
	if (idToCheck === adminId) {
		return true;
	}
	return false;
}

module.exports = { isUserAdmin };