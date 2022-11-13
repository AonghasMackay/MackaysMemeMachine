const fs = require('fs');
const { DEBUG } = require('../config.json');

function writeToLogs(logType, logText) {
	try {
		const currentTime = new Date();
		const currentTimeString = currentTime.toDateString() + ' ' + currentTime.toLocaleTimeString();

		if (!logType) {
			logType = 'OTHER';
		}

		if (logType === 'DEBUG' && !DEBUG) {
			return;
		}

		fs.appendFile('logging/logs.txt', `[${currentTimeString}] :: [${logType}] :: ${String(logText)} \n`, function(error) {
			if (error) {
				return console.log(error);
			}
			console.log('Log file updated');
		});

	} catch (error) {
		console.log(error);
	}
}

function clearLogs() {
	fs.writeFile('logging/logs.txt', '', function(error) {
		if (error) {
			return console.log(error);
		}
		console.log('Log file cleared');
	});
}

module.exports = { writeToLogs,  clearLogs };