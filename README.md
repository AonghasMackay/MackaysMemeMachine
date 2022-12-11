# MackaysMemeMachine
Discord bot for score keeping based on custom emoji reactions. Work in progress.


## How it works

The bot is primarilly built with node, [discord.js](https://discord.js.org/#/) and [Sequelize](https://sequelize.org).

Additionally it uses the [cron package](https://www.npmjs.com/package/cron) to schedule and run cron jobs and the [ascii-table3 package](https://www.npmjs.com/package/ascii-table3) to format tables.


## Features

+ Score keeping based on two custom emoji (configurable) reactions
+ A limited balance of points to be given or taken away, by each user, per day
+ Cron jobs to reset users balance per day or to assign, and record, a winner for the month and reset the scoreboard
+ An outputable monthly scoreboard & overall leaderboard
+ The ability to mute the bot
+ Error & Info logging
+ Debug mode with increased logging and the ability to react to your own messages


### Scoreboard
![](readmeImages/mmm-scoreboard-table.PNG)
![](readmeImages/mmm-scoreboard-table-output.PNG)

### Leaderboard
![](readmeImages/mmm-leaderboard-table.PNG)
![](readmeImages/mmm-leaderboard-table-output.PNG)


## Limitations

As this project was designed as a side project both to learn node and for fun it is has several limitations. 

The bot is not intended for use on multiple servers and must have a primary server and admin assigned in the config. The database schema also makes no distinction between servers. This means users balances, scoreboards and the monthly leaderboard are all shared between servers. 

The bot is not set up to be distributed. If you wish to use or fork the bot then a config.json file must be provided following the configTemplate.json structure.
