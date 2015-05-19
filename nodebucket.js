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
var irc       = require("irc")
  , mysql     = require("mysql")
  , orm       = require("orm");


// Define our connection to the database
// The example mysql connection file on github is called mysqlConfig.js
var myORM     = require("./scripts/mysqlConfig")
  , FACTS     = null
  , DEBUG     = true
  , ircConfig = require('./scripts/ircConfig')
  , CLIENT    = null;
// var db = orm.connect(myORM.config);

var   RED     = '\033[1;31m'
	, MAGENTA = '\033[1;35m'
	, CYAN    = '\033[1;36m'
	, NC      = '\033[0m';


function error(text, newline) {
	if (newline) {
		console.error("%sError%s: %s", RED, NC, text);
	} else {
		process.stderr.write(RED + "Error" + NC + ": " + text);
	}
}


function warn(text, newline) {
	if (newline) {
		console.error("%Warning%s: %s", MAGENTA, NC, text);
	} else {
		process.stderr.write(RED + "Warning" + NC + ": " + text);
	}
}


function debug(text) {
	/* Prints debugging output if we're in debug mode,
	 uses console.log if newline is true */

	if (!DEBUG) {
		return;
	}

	console.log("%sDebug%s: %s", CYAN, NC, text);
}


function findPattern(input) {
	// TODO I want to come up with some clever list or array method of going through the regexes, eventually
	// Maybe a hashmap iteration, but I am not sure about it

	// TODO need to add:
	// what was that
	// forget that
	// forget #xxx

	var verbs = {
		reply     : /[^]( <reply> )(.+)?/i,
		action    : /[^]( <action> )(.+)?/i,
		are       : /[^]( are )(.+)?/i,
		is        : /[^]( is )(.+)?/i,
		loves     : /[^]( loves )(.+)?/i,
		strangles : /[^]( strangles )(.+)?/i
	}

	for (var key in verbs) {
		if (verbs[key].test(input)) {
			return key;
		}
	}

	return "none";
}

function printToChannel(printString, channel) {
	try {
		if(!channel) {
			CLIENT.say(config.channels[0], printString);
		} else{
			if(printString) {
				CLIENT.say(channel, printString);
			}
		}
	}
	catch(err) {
		console.log("Fail in printToChannel, catch: " + err);

	}
};

/**** DB API FUNCTIONS ****/

function onDbConnect(err, db) {
	debug("Connection established with database.");

	if (err) {
		error("Connection to database failed, reason: " + err);

		process.exit(123);
	}

	// Facts will always be defined if the database connection
	// succeeded. If it didn't succeed, the process exits anyways
	FACTS = db.define('bucket_facts', {
		id 			: { type: "number" },
		fact 		: { type: "text" },
		tidbit 		: { type: "text"},
		verb 		: { type: "text"},
		RE 			: { type: "number"},
		protected 	: { type: "number"},
		mood 		: { type: "text"},
		chance 		: { type: "number"}
	});
}

function dbFind(text, callback) {
	FACTS.find(
		{
			fact: text
		},
		function(err, all_facts) {

			if (err) throw err;

			try {
				var num = all_facts.length;
				// TODO Temporary logging of data, may be removed in production
				console.log("Total facts found: " + num.toString(), ircConfig.config.channels[1]);
				// printToChannel("Total facts found: " + num.toString(),config.channels[1]);
				if (num > 1) {
					var num = Math.floor((Math.random()*num));
					// TODO Temporary logging of data, may be removed in production
					// printToChannel("Attempting to access number " + num.toString(),config.channels[1]);
					console.log("Attempting to access number " + num.toString(), ircConfig.config.channels[1]);
					callback(all_facts[num].tidbit);
				} else {
					// TODO Temporary logging of data, may be removed in production
					callback(all_facts[0].tidbit);
				}
			}
			catch(err) {
				warn("Failed in Bucket_Facts, catch: " + err);
				warn("Text was " + text);
			}
	});
		
}

function dbInsert(fact, tidbit, verb, RE, protected, callback) {
	var newRecord = {};
	newRecord.fact = fact;
	newRecord.tidbit = tidbit;
	newRecord.verb = verb;
	newRecord.RE = RE;
	newRecord.protected = protected;

	FACTS.create(newRecord, function(err, results) {
				if (err) throw err;
				else callback("okay, $who");
			});
}


function dbCommand(text) {
	var returned = findPattern(text);
	var fact = "";
	var tidbit = "";
	var verb = "";
	var RE = 0;
	var protected = 0;
	switch(returned) {
		case 'reply':
			// Basic bot key phrase response insertion
			result = text.split(/ <reply> (.+)?/);
			fact = result[0];
			tidbit = result[1];
			verb = "<reply>";
			break;

		case 'action':
			// Basic bot key phrase to do a /me + response insertion
			result = text.split(/ <action> (.+)?/);
			fact = result[0];
			tidbit = result[1];
			verb = "<action>";
			break;

		case 'are':
			// Assign synonyms to keywords
			result = text.split(/ are (.+)?/);
			fact = result[0];
			tidbit = result[1];
			verb = "are";
			break;

		case 'is':
			// Assign verbs to keywords
			result = text.split(/ is (.+)?/);
			fact = result[0];
			tidbit = result[1];
			verb = "is";
			break;

		case 'loves':
			// Describe items of affectation for keywords
			result = text.split(/ loves (.+)?/);
			fact = result[0];
			tidbit = result[1];
			verb = "loves";
			break;

		case 'strangles':
			// List items of annoyance for keywords
			result = text.split(/ strangles (.+)?/);
			fact = result[0];
			tidbit = result[1];
			verb = "strangles";
			break;

		case 'none':
			// If a command was not understood
			dbFind("failresponse", printToChannel);

		default:
			// Basic bot key phrase response insertion

			break;

	}
	if (returned != 'none') {
		dbInsert(result[0], result[1], "<reply>", 0, 0, printToChannel);
	}
}




/**** IRC FUNCTIONS ****/

function onIRCConnect() {
	debug("Connected to IRC.");
}


function onIRCError(msg) {
	throw msg;
}


function onIRCJoin(channel, who) {
	debug(who + " joined " + channel);

	if (who === ircConfig.config.botName) {

		debug("Hey, that's me!");
	}
}

function onIRCMsg(from, to, text, message) {

	if (text.length > 5) {
		try {
				// Database Command detection
				// If the beginning of the text is the bot's name, then send to command sequence
				if (text.substr(0,ircConfig.config.botName.length + 2) == (config.botName + ", ")) {
					dbCommand(text.substr(ircConfig.config.botName.length+2));
					// TODO Temporary logging of data, may be removed in production
					printToChannel("Finished with command stuff", ircConfig.config.channels[1]);
				
				} else {
					// Standard trigger lookup
					// TODO Temporary logging of data, may be removed in production
					console.log("In message listener, should print factoid if found.",ircConfig.config.channels[1]);
					dbFind(text, printToChannel);
				}
		}
		catch(err) {
			// TODO Temporary logging of data, may be removed in production
			warn("Fail in connect: " + err.message, ircConfig.config.channels[1]);
		}
	}

}


function initIRC() {
	var config = null;

	debug("Reading IRC config...");

	try {
		config = ircConfig.config;
	} catch (err) {
		error("IRC configuration failed, reason: " + err);

		process.exit(100);
	}

	debug("Attempting to connect to IRC...");

	var client = new irc.Client(config.server, config.botName, { 
		channels: config.channels
	});


	// Do the client's event registration here
	client.on('registered', onIRCConnect);
	client.on('error', onIRCError);
	client.on('join', onIRCJoin);
	client.on('message', onIRCMsg);


	return client;
}

// entry point for all execution
function main() {
	// Do db init
	try {
		orm.connect(myORM.config, onDbConnect);

		var ircCfg = require('./scripts/ircConfig');

		CLIENT = initIRC(ircCfg.config);
	} catch (err) {
		error("Uncaught exception in top-level try-except, error: " + error);
	}
}

main();
