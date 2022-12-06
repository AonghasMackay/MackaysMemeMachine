const { writeToLogs } = require('../logging/logging');

module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		console.log(`Ready! ${client.user.tag} is running.`);
		writeToLogs('INFO', '\n ------------------------------------------------------------------------ \n BOT RESTARTED \n \n');

		//for each channel the bot is in fetch the last 100 messages
		try {
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
	},
};