/**
 * Wait for a given amount of time in milliseconds
 *
 * @param {int} milliseconds
 * @returns {Promise}
 */
function wait(milliseconds) {
	return new Promise(resolve => setTimeout(resolve, milliseconds));
}

module.exports = { wait };