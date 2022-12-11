/**
 * @todo add command to see leaderboard and user info (if bot is muted, number of scoreboards won, etc.)
 * @todo add help command to show all commands and explain how bot works
 * @todo host bot online somewhere
 * @todo restart on uncaught exception
 */

'use strict';

//Imports
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');
const { createResetBalanceCronJob } = require('./cronJobs/resetBalance.js');
const { createLeaderboardUpdateCronJob } = require('./cronJobs/leaderboardUpdate.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMembers ] });

//Create a new Discord.collection for commands
client.commands = new Collection();
//Set file paths for commands and events
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

//Create cron jobs
createResetBalanceCronJob();
createLeaderboardUpdateCronJob(client);

//Import all commands
for (const file of commandFiles) {
	//Get the command file path
	const filePath = path.join(commandsPath, file);
	//Require the command file
	const command = require(filePath);
	// Set a new item in the commands Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}

//Import all events
for (const file of eventFiles) {
	//Get the event file path
	const filePath = path.join(eventsPath, file);
	//Require the event file
	const event = require(filePath);
	if (event.once) {
		//Add one time event listener for event
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		//Add event listener for event
		client.on(event.name, (...args) => event.execute(...args));
	}
}

//Add event listener for interactionCreate
//https://discord.com/developers/docs/topics/gateway-events#interaction-create
client.on('interactionCreate', async interaction => {
	//If the interaction is not a ChatInputCommandInteraction, return
	//https://discord.js.org/#/docs/discord.js/14.7.1/class/ChatInputCommandInteraction
	if (!interaction.isChatInputCommand()) return;

	//Get the command from the commands collection
	const command = interaction.client.commands.get(interaction.commandName);

	//If the command does not exist, return
	if (!command) return;

	try {
		//execute the command
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

//Log the client in, establishing a WebSocket connection to Discord.
client.login(token);