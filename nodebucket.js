/*
* name:     nodebucket.js
* author:   Chad Hobbs
* contributors: None
* created:  140327
*
* description: This is the glory and wonder that is node bot
*/

/* ----------------------------------------------------------------------------------------
* 									Configurations and Libraries
*  ----------------------------------------------------------------------------------------
*/

// Dependencies
var irc = require("irc");
var bukketLoad = require("./modules/bukket")
var bukket = bukketLoad.bukket;

// The config library is used to pull in custom irc server config files and specific modules for this bot
// The normal config file in github is called ircConfig.js
var modConfig = require("./scripts/ircConfig")
var config = modConfig.config;

// TODO I believe I need require in order to implement dynamic script loading
//var req = require("require")


/* ----------------------------------------------------------------------------------------
* 										Global Objects
*  ----------------------------------------------------------------------------------------
*/
// Create the bot name
var bot = new irc.Client(config.server, config.botName, { 
	channels: config.channels
});

/* ----------------------------------------------------------------------------------------
* 										Functions
*  ----------------------------------------------------------------------------------------
*/

/* ----------------------------------------------------------------------------------------
* Function Name: processText
* Parameters:    text: The text to be proccessed
* Parameters:    callback: Where the results of the processed message are sent, typically printToChannel()
* Returns:       NA
* Description:   This function prints a given to string to the supplied channel, else provides a default channel
*  ----------------------------------------------------------------------------------------
*/ 
function processText(text, callback) {

	// TODO test loopback
	callback(bukket.say(text));

}


/* ----------------------------------------------------------------------------------------
* Function Name: printToChannel
* Parameters:    printString: The string that needs to be sent to the irc channel
* Parameters:    channel: The specific channel to send it to, or default to the control channel
* Returns:       NA
* Description:   This function prints a given to string to the supplied channel, else provides a default channel
*  ----------------------------------------------------------------------------------------
*/ 
function printToChannel(printString, channel) {
	try {
			if(!channel) {
			bot.say(config.channels[0], printString);
		} else{
			if(printString) {
				bot.say(channel, printString);
			}
		}
	}
	catch(err) {
		console.log("Fail in printToChannel, catch: " + err);

	}
};


/* ----------------------------------------------------------------------------------------
* Function Name: Main listener loop
* Parameters:    None
* Returns:       None
* Description:   This is all the channel listeners, and commits actions based on the messages
*  ----------------------------------------------------------------------------------------
*/
try {
	// Error handling
	bot.addListener('error', function(message) {
		throw message;
	});

	// JOINS
	bot.addListener("join", function(channel, who) {
		// Welcome them in!
		printToChannel(who + "...dude...welcome back!", channel);
	});


	// TEST MESSAGE RESPONSE
	bot.addListener("message", function(from, to, text, message) {

		processText(text, printToChannel);


		/*

		if (text.length > 5) {
			try {
					// Database Command detection
					// If the beginning of the text is the bot's name, then send to command sequence
					if (text.substr(0,config.botName.length + 2) == (config.botName + ", ")) {
						dbCommand(text.substr(config.botName.length+2));
						// TODO Temporary logging of data, may be removed in production
						printToChannel("Finished with command stuff",config.channels[1]);
					
					} else {
						// Standard trigger lookup
						// TODO Temporary logging of data, may be removed in production
						printToChannel("In message listener, should print factoid if found.",config.channels[1]);
						dbFind(text, printToChannel);
					}
			}
			catch(err) {
				// TODO Temporary logging of data, may be removed in production
				printToChannel("Fail in connect: " + err.message,config.channels[1]);
			}
		} */

			/* TODO I've kept this commented just to see what all the message params are
		}
		switch(text) {
			case 'message arguments':
				printToChannel("The following is what was recieved.");
				printToChannel("prefix: " + message.prefix);
				printToChannel("nick: " + message.nick);
				printToChannel("user: " + message.user);
				printToChannel("host: " + message.host);
				printToChannel("server: " + message.server);
				printToChannel("rawCommand: " + message.rawCommand);
				printToChannel("command: " + message.command);
				printToChannel("commandType: " + message.commandType);
				break;
		} */

	});

	// KICKS
	bot.addListener("kick", function(channel, who, by, reason, message) {
		// Send them on their way
		printToChannel("GTFO " + who + "!!!");
		printToChannel(reason + " is a shitty way to go...");
	});

}
catch(err) {
	console.log(err.message);
}