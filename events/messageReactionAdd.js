const { users } = require('../database/dbObjects.js');
const { writeToLogs } = require('../logging/logging.js');
const { DEBUG } = require('../config.json');

/**
 * @todo add a check to see if user has already reacted to the meme
 * @todo abstract out some of the repetitive code into other functions
 * @todo switch module exports to use other method for consistancy
 */
module.exports = {
	name: 'messageReactionAdd',
	execute(reaction) {
		const emojiName = reaction.emoji.name;

		if (emojiName == 'AonLUL') {
			const reactor = reaction.users.cache.last();
			const author  = reaction.message.author;

			if (reactor.id == author.id && !DEBUG) {
				return;
			}

			if (author.bot) {
				return;
			}

			users.prototype.hasPositiveBalance(reactor.id).then(hasPositiveBalance => {
				if (!hasPositiveBalance) {
					sendNegativeBalanceMessages(reactor, author, emojiName);
					return;
				} else {

					try {
						users.prototype.addScore(author.id);
						users.prototype.lowerBalance(reactor.id);

						console.log(`${reactor.username} reacted to ${author.username}'s meme with ${emojiName}! +1 point to ${author.username}`);

						author.send(`${reactor.username} reacted to your meme with ${emojiName}! +1 point.`);
						reactor.send(`You reacted to ${author.username}'s meme with ${emojiName}! +1 point to ${author.username}`);
					} catch (error) {
						writeToLogs('ERROR', error);
					}
				}
			}).catch(error => {
				writeToLogs('ERROR', error);
			});

		} else if (emojiName == 'MossMoment') {
			const reactor = reaction.users.cache.last();
			const author  = reaction.message.author;

			if (reactor.id == author.id && !DEBUG) {
				return;
			}

			if (author.bot) {
				return;
			}

			users.prototype.hasPositiveBalance(reactor.id).then(hasPositiveBalance => {
				if (!hasPositiveBalance) {
					sendNegativeBalanceMessages(reactor, author, emojiName);
					return;
				} else {

					try {
						users.prototype.removeScore(author.id);
						users.prototype.lowerBalance(reactor.id);

						console.log(`${reactor.username} reacted to ${author.username}'s meme with ${emojiName}! -1 point from ${author.username}`);

						author.send(`${reactor.username} reacted to your meme with ${emojiName}! -1 point.`);
						reactor.send(`You reacted to ${author.username}'s meme with ${emojiName}! -1 point from ${author.username}`);
					} catch (error) {
						writeToLogs('ERROR', error);
					}
				}
			}).catch(error => {
				writeToLogs('ERROR', error);
			});
		}
	},
};

function sendNegativeBalanceMessages(reactor, author, emojiName) {
	reactor.send(`Your points balance is too low to add or remove points from ${author.username}. It will reset at the end of the day.`);
	console.log(`${reactor.username} reacted to ${author.username}'s meme with ${emojiName} but their balance is too low.`);
	return;
}