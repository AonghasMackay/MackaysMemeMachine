const fs = require('fs');
const { DEBUG } = require('../config.json');

/**
 * Checks log is valid and then writes it to the logs.txt file
 *
 * @param {String} logType - type of log
 * @param {String} logText - error message
 * @returns {undefined}
 */
function writeToLogs(logType, logText) {
	try {
		const currentTime = new Date();
		const currentTimeString = currentTime.toDateString() + ' ' + currentTime.toLocaleTimeString();

		if (logType === 'DEBUG' && !DEBUG) {
			return;
		}

		writeLog(currentTimeString, logType, logText);
		return;

	} catch (error) {
		console.log(error);
		return;
	}
}

/**
 * Writes a log to the logs.txt file
 *
 * @param {String} currentTimeString - string represnting time log was written
 * @param {String} logType - type of log
 * @param {String} logText - error message
 * @returns {undefined}
 */
function writeLog(currentTimeString, logType, logText) {
	if (!logType) {
		logType = 'OTHER';
	}

	fs.appendFile('logging/logs.txt', `[${currentTimeString}] :: [${logType}] :: ${String(logText)} \n`, function(error) {
		if (error) {
			return console.log(error);
		}
		console.log('Log file updated');
	});

	return;
}

/**
 * Clears the logs.txt file
 *
 * @returns {undefined}
 */
function clearLogs() {
	fs.writeFile('logging/logs.txt', '', function(error) {
		if (error) {
			return console.log(error);
		}
		console.log('Log file cleared');
	});

	return;
}

/**
 * Creates a line break in the logs.txt file to indicate a bot restart without using the normal log format
 *
 * @returns {undefined}
 */
function logBotStartup() {
	fs.appendFile('logging/logs.txt', '\n------------------------------------------------------------------------ \nBOT RESTARTED \n \n', function(error) {
		if (error) {
			return console.log(error);
		}
		console.log('Log file updated');
	});
}

module.exports = { writeToLogs,  clearLogs, logBotStartup };