const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Displays a list of commands and instructions on how to use the bot.'),
	async execute(interaction) {
		await interaction.reply('WIP');
	},
};