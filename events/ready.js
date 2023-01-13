'use strict';

const { ActivityType } = require('discord.js');
const { writeToLogs, logBotStartup } = require('../logging/logging');
const { DEBUG } = require('../config.json');

module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		readyEventHandler(client);
	},
};

/**
 * On ready event send startup messages to console and log files.
 * Then fetch the last 100 messages from each channel the bot is in.
 *
 * @param {Discord.client} client
 * @returns {undefined}
 */
function readyEventHandler(client) {
	console.log(`Ready! ${client.user.tag} is running.`);
	logBotStartup();

	if (DEBUG) {
		console.log('DEBUG MODE IS ON \n---------------------');
	}

	client.user.setActivity(' you...', { type: ActivityType.Watching });

	fetchLast100Messages(client);
}

/**
 * Caches the last 100 messages from each channel the bot is in.
 *
 * @param {Discord.client} client
 * @returns {undefined}
 */
function fetchLast100Messages(client) {
	try {
		//for each channel the bot is in fetch the last 100 messages
		client.channels.cache.forEach(channel => {
			/**
			 * Detects if the channel is a text channel.
			 * See documentaion on channel types:
			 * https://discord.com/developers/docs/resources/channel#channel-object-channel-types
			 */
			if (channel.type == 0) {
				channel.messages.fetch({ limit: 100 }).then(messages => {
					writeToLogs('INFO', `Fetched ${messages.size} messages from ${channel.name} on startup.`);
				}).catch(error => {
					writeToLogs('ERROR', error);
				});
			}
		});
	} catch (error) {
		writeToLogs('ERROR', error);
	}
}