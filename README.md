# MackaysMemeMachine
Discord bot for score keeping based on custom emoji reactions. Work in progress. Please provide credit if you fork the project


## How it works

The bot is primarilly built with node (v16.17.0), [discord.js](https://discord.js.org/#/) and [Sequelize](https://sequelize.org).

Additionally it uses the [cron package](https://www.npmjs.com/package/cron) to schedule and run cron jobs and the [ascii-table3 package](https://www.npmjs.com/package/ascii-table3) to format tables. A simple healthcheck is built using [Express](https://www.npmjs.com/package/express) for use with app hosting services such as Render.


## Features

+ Score keeping based on two custom emoji (configurable) reactions
+ A limited balance of points to be given or taken away, by each user, per day
+ Cron jobs to reset users balance per day or to assign, and record, a winner for the month and reset the scoreboard
+ An outputable monthly scoreboard & overall leaderboard
+ The ability to mute the bot
+ Error & Info logging
+ Debug mode with increased logging and the ability to react to your own messages
+ Simple healthcheck at the endpoint /healthcheck

### Scoreboard
![](readmeImages/mmm-scoreboard-table.PNG)
![](readmeImages/mmm-scoreboard-table-output.PNG)

### Leaderboard
![](readmeImages/mmm-leaderboard-table.PNG)
![](readmeImages/mmm-leaderboard-table-output.PNG)

### Console & Logging
![](readmeImages/mmm-cli.PNG)
![](readmeImages/mmm-logs.PNG)

## Limitations

As this project was designed as a side project to learn node it is has several limitations. 

The bot is not intended for use on multiple servers and must have a primary server and admin assigned in the config. The database schema also makes no distinction between servers. This means users balances, scoreboards and the monthly leaderboard are all shared between servers. 

The bot is not set up to be distributed. If you wish to use or fork the bot then a config.json file must be provided following the configTemplate.json structure.

## Known Issues

+ Users can react, then remove the reaction, then react again to stack points on a single post

## Setup

**Please remember this bot was not designed to be distributed and may require some tinkering to work on other servers!**

1. [Setup a bot application in the discord developer portal](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot) so that you have an api token. Some familiarity with discord bot permissions will be needed.
2. Create a config.json file matching the format of the configTemplate.json. For app hosting services this may need to be done via their platform.
3. [Add the bot to your server](https://discordjs.guide/preparations/adding-your-bot-to-servers.html#bot-invite-links)
4. Run the setup.bash script
