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
var mysql = require("mysql");
var orm = require("orm");


// Define our connection to the database
// The example mysql connection file on github is called mysqlConfig.js
var myORM = require("./scripts/mysqlConfig");
var db = orm.connect(myORM.config);



db.on("connect", function(err) {
	if (err) {
		console.log("The connection failed", err);
		return;
	}


	/* ----------------------------------------------------------------------------------------
	* 											Models
	*  ----------------------------------------------------------------------------------------
	*/
	var Bucket_Facts = db.define('bucket_facts', {
		id 			: { type: "number" },
		fact 		: { type: "text" },
		tidbit 		: { type: "text"},
		verb 		: { type: "text"},
		RE 			: { type: "number"},
		protected 	: { type: "number"},
		mood 		: { type: "text"},
		chance 		: { type: "number"}
	});



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
	* Function Name: dbFind
	* Parameters:    text: the fact to be searched for
	* Returns:       the query results
	* Description:   This function is used to access the bot database and perform a select
	*  ----------------------------------------------------------------------------------------
	*/ 
	function dbFind(text) {
		Bucket_Facts.find({ fact: text}, function(err, all_facts) {
			if (err) throw err;
			try {
				var num = all_facts.length;
				console.log("Total facts found: %d", num);
				if (num > 1) {
					var num = Math.floor((Math.random()*num));
					console.log("Attempting to access number " + num);
					return all_facts[num].tidbit;
				} else {
					console.log(all_facts[0].tidbit);
					return all_facts[0].tidbit;
				}
			}
			catch(err) {
				console.log("Failed in Bucket_Facts, catch: " + err);
			}
		});
			
	};


	/* ----------------------------------------------------------------------------------------
	* Function Name: dbInsert
	* Parameters:    fact: The trigger to be inserted
	* Parameters: 	 tidbit: The response to be inserted
	* Parameters: 	 verb: The action type to be inserted
	* Parameters: 	 RE: Dunno what this does, keeping it for legacy
	* Parameters: 	 protected: Is this erase safe
	* Returns:       the Insert result
	* Description:   This function issues various commands to the bot
	*  ----------------------------------------------------------------------------------------
	*/
	function dbInsert(fact, tidbit, verb, RE, protected) {
		// TODO - Implement


	}



	/* ----------------------------------------------------------------------------------------
	* Function Name: dbCommand
	* Parameters:    text: String to be analyzed to determine what command is being issued
	* Returns:       the Command results
	* Description:   This function issues various commands to the bot
	*  ----------------------------------------------------------------------------------------
	*/
	function dbCommand(text) {
		var returned = findPattern(text);
		printToChannel("Looking at: " + text);
		var newRecord = {};
		var status = "Okay, $who";
		switch(returned) {
			case 'reply':
				// Basic bot key phrase response insertion
				result = text.split(/ <reply> (.+)?/);
				newRecord.fact = result[0];
				newRecord.tidbit = result[1];
				newRecord.verb = "<reply>";
				newRecord.RE = 0;
				newRecord.protected = 0;
				Bucket_Facts.create(newRecord, function(err, results) {
					if (err) throw err;
				});
				break;
			case 'action':
				// Basic bot key phrase to do a /me + response insertion
				result = text.split(/ <action> (.+)?/);
				newRecord.fact = result[0];
				newRecord.tidbit = result[1];
				newRecord.verb = "<action>";
				newRecord.RE = 0;
				newRecord.protected = 0;
				Bucket_Facts.create(newRecord, function(err, results) {
					if (err) throw err;
				});

				break;
			case 'are':
				// Assign synonyms to keywords
				result = text.split(/ are (.+)?/);
				newRecord.fact = result[0];
				newRecord.tidbit = result[1];
				newRecord.verb = "are";
				newRecord.RE = 0;
				newRecord.protected = 0;
				Bucket_Facts.create(newRecord, function(err, results) {
					if (err) throw err;
				});

				break;
			case 'is':
				// Assign verbs to keywords
				result = text.split(/ is (.+)?/);
				newRecord.fact = result[0];
				newRecord.tidbit = result[1];
				newRecord.verb = "is";
				newRecord.RE = 0;
				newRecord.protected = 0;
				Bucket_Facts.create(newRecord, function(err, results) {
					if (err) throw err;
				});
				break;

			case 'loves':
				// Describe items of affectation for keywords
				result = text.split(/ loves (.+)?/);
				newRecord.fact = result[0];
				newRecord.tidbit = result[1];
				newRecord.verb = "loves";
				newRecord.RE = 0;
				newRecord.protected = 0;
				Bucket_Facts.create(newRecord, function(err, results) {
					if (err) throw err;
				});
				break;

			case 'strangles':
				// List items of annoyance for keywords
				result = text.split(/ strangles (.+)?/);
				newRecord.fact = result[0];
				newRecord.tidbit = result[1];
				newRecord.verb = "strangles";
				newRecord.RE = 0;
				newRecord.protected = 0;
				Bucket_Facts.create(newRecord, function(err, results) {
					if (err) throw err;
				});
				break;

			case 'none':
				// If a command was not understood
				status = "I did not understand.";
			default:
				// Basic bot key phrase response insertion

				break;

		}
			
		return status; // TODO Temp filler until function completed
	}


	/* ----------------------------------------------------------------------------------------
	* Function Name: findPattern
	* Parameters:    input: The text to be examined for regex matches
	* Returns:       returned: The case that the input matches, as a string
	* Description:   This function goes through regexes to find which command to apply to input
	*  ----------------------------------------------------------------------------------------
	*/
	function findPattern(input) {
		// TODO I want to come up with some clever list or array method of going through the regexes, eventually
		// Maybe a hashmap iteration, but I am not sure about it

		// TODO need to add:
		// what was that
		// forget that
		// forget #xxx

		var returned = "none";
		var reply = /[^]( <reply> )(.+)?/i;
		var action = /[^]( <action> )(.+)?/i;
		var are = /[^]( are )(.+)?/i;
		var is = /[^]( is )(.+)?/i;
		var loves = /[^]( loves )(.+)?/i;
		var strangles = /[^]( strangles )(.+)?/i;
		
		if (reply.test(input)) {
			returned = "reply"
		} else if (action.test(input)) {
			returned = "action"
		} else if (are.test(input)) {
			returned = "are"
		} else if (is.test(input)) {
			returned = "is"
		} else if (loves.test(input)) {
			returned = "loves"
		} else if (strangles.test(input)) {
			returned = "strangles"
		} else {
			returned = "none";
		}
		return returned;
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
				bot.say(channel, printString);
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

			if (text.length > 5) {
				try {
						// Database Command detection
						// If the beginning of the text is the bot's name, then send to command sequence
						if (text.substr(0,config.botName.length + 2) == (config.botName + ", ")) {
							printToChannel(dbCommand(text.substr(config.botName.length+2)));
							console.log("Finished with command stuff");
						
						} else {
							// Standard trigger lookup
							var printit = "hello";
							console.log("In message listener, should print factoid if found.");
							printit = dbFind(text);
							printToChannel(printit);						
						}
				}
				catch(err) {
					console.log("Fail in connect: " + err.message)
					printToChannel("That didn't work...");
				}
			}

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

});
