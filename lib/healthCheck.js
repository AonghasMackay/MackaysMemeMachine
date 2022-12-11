const express = require('express');
const app = express();

/**
 * Creates a health check endpoint which returns 200
 */
function setupHealthCheckEndpoint() {
	app.get('/healthcheck', (req, res) => {
		console.log('Health check request recieved');
		res.status(200).end();
	});

	app.listen(process.env.PORT);
	console.log(`Api Server running on ${process.env.PORT} port, PID: ${process.pid}`);
}

module.exports = { setupHealthCheckEndpoint };