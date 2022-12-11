'use strict';

const { users } = require('../database/dbObjects.js');
const { writeToLogs } = require('../logging/logging.js');
const { DEBUG, positiveEmoji, negativeEmoji } = require('../config.json');

module.exports = {
	name: 'messageReactionAdd',
	execute(reaction) {
		messageReactionAddEventHandler(reaction);
	},
};

/**
 * Handles the messageReactionAdd event
 *
 * @param {Discord.MessageReaction} reaction - The reaction object
 * @returns {undefined}
 */
function messageReactionAddEventHandler(reaction) {
	const emojiName = reaction.emoji.name;
	const reactor = reaction.users.cache.last();
	const author  = reaction.message.author;

	if (!isReactionValid(reactor, author)) {
		return;
	}

	users.prototype.hasPositiveBalance(reactor.id).then(hasPositiveBalance => {
		if (!hasPositiveBalance) {
			sendNegativeBalanceMessages(reactor, author, emojiName);
			return;
		} else {
			alterScoreAndBalance(emojiName, author, reactor);
		}
	}).catch(error => {
		writeToLogs('ERROR', error);
	});

	return;
}

/**
 * Alter the score of the author of the message and lower the balance of the reactor
 *
 * @param {String} emojiName - The custom emoji reacted with
 * @param {Discord.User} reactor - the user who reacted to the message
 * @param {Discord.User} author - the author of the message
 * @returns {undefined}
 */
function alterScoreAndBalance(emojiName, author, reactor) {
	try {

		let operatorSymbol = '+';
		if (emojiName == positiveEmoji) {
			users.prototype.addScore(author.id);
		} else if (emojiName == negativeEmoji) {
			users.prototype.removeScore(author.id);
			operatorSymbol = '-';
		} else {
			return;
		}
		users.prototype.lowerBalance(reactor.id);
		sendEventMessages(reactor, author, emojiName, operatorSymbol);

	} catch (error) {
		writeToLogs('ERROR', error);
	}

	return;
}

/**
 * Checks if the reaction is valid
 *
 * @param {Discord.User} reactor - the user who reacted to the message
 * @param {Discord.User} author - the author of the message
 * @returns {Boolean}
 */
function isReactionValid(reactor, author) {
	if (reactor.id == author.id && !DEBUG) {
		return false;
	}

	if (author.bot) {
		return false;
	}

	return true;
}

/**
 * Sends messages to the reactor and author of the message
 *
 * @param {Discord.User} reactor - the user who reacted to the message
 * @param {Discord.User} author - the author of the message
 * @param {String} emojiName - The custom emoji reacted with
 * @param {String} operatorSymbol - '+' or '-'
 * @returns {undefined}
 */
function sendEventMessages(reactor, author, emojiName, operatorSymbol) {
	console.log(`${reactor.username} reacted to ${author.username}'s meme with ${emojiName}!  ${operatorSymbol}1 point for ${author.username}`);

	users.prototype.isBotMuted(author.id).then(isBotMuted => {
		if (!isBotMuted) {
			author.send(`${reactor.username} reacted to your meme with ${emojiName}!  ${operatorSymbol}1 point.`);
		}
	}).catch(error => {
		writeToLogs('ERROR', error);
	});

	users.prototype.isBotMuted(reactor.id).then(isBotMuted => {
		if (!isBotMuted) {
			reactor.send(`You reacted to ${author.username}'s meme with ${emojiName}!  ${operatorSymbol}1 point for ${author.username}`);
		}
	}).catch(error => {
		writeToLogs('ERROR', error);
	});

	return;
}

/**
 * Sends a negative balance message to the reactor and then returns
 *
 * @param {Discord.User} reactor - the user who reacted to the message
 * @param {Discord.User} author - the author of the message
 * @param {String} emojiName - The custom emoji reacted with
 * @returns {undefined}
 */
function sendNegativeBalanceMessages(reactor, author, emojiName) {
	users.prototype.isBotMuted(reactor.id).then(isBotMuted => {
		if (!isBotMuted) {
			reactor.send(`Your points balance is too low to add or remove points from ${author.username}. It will reset at the end of the day.`);
		}
	}).catch(error => {
		writeToLogs('ERROR', error);
	});

	console.log(`${reactor.username} reacted to ${author.username}'s meme with ${emojiName} but their balance is too low.`);
	return;
}