const { users } = require('../database/dbObjects.js');
const { SlashCommandBuilder } = require('discord.js');
const { writeToLogs } = require('../logging/logging');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('mutebot')
		.setDescription('Mutes messages from the bot'),
	async execute(interaction) {
		toggleBotSilenced(interaction);
	},
};

/**
 * Toggles the bot being muted for the interactions user
 *
 * @param {Discord.interaction} interaction
 */
function toggleBotSilenced(interaction) {
	const userID = interaction.user.id;

	users.prototype.muteBot(userID).then(value => {
		if (value.dataValues.silenced_bot) {
			interaction.reply('Bot direct messages are now disabled.');
		} else {
			interaction.reply('Bot direct messages are now enabled.');
		}
	}).catch(error => {
		writeToLogs('ERROR', error);
	});
}