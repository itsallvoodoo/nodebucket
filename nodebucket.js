/*
* name:     nodebucket.js
* author:   Chad Hobbs
* contributors: None
* created:  140327
*
* description: This is the glory and wonder that is node bucket
*/


var irc       = require("irc")
  , mysql     = require("mysql")
  , orm       = require("orm")
  , myORM     = require("./scripts/mysqlConfig")
  , ircConfig = require('./scripts/ircConfig')
  , FACTS     = null
  , DEBUG     = true
  , CLIENT    = null
  , RED       = '\033[1;31m'
  , MAGENTA   = '\033[1;35m'
  , CYAN      = '\033[1;36m'
  , NC        = '\033[0m'
  , MAXTLEN   = 5;


var BOTNAME   = ircConfig.config.botName
  , MAINCHAN  = null;


// Helps us set the channel as the first one that we find
// A better configuration style might improve this, like { mainchan: "", cmdchan: "", logchan: ""}
for (var ind = 0; ind < ircConfig.config.channels.length; ind++) {
	if (!MAINCHAN) {
		MAINCHAN = ircConfig.config.channels[ind];
	}
}

if (!MAINCHAN) {
	error(" Unable to set main channel for IRC config.\n\
	This is likely due to the channel config not being an array, or having no elements.");

	process.exit(1);
}

function error(text, newline) {
	console.error("%sError%s: %s", RED, NC, text);
}


function warn(text, newline) {
	console.error("%sWarning%s: %s", MAGENTA, NC, text);
}


function debug(text) {
	/* Prints debugging output if we're in debug mode,
	 uses console.log if newline is true */

	if (!DEBUG) {
		return;
	}

	console.log("%sDebug%s: %s", CYAN, NC, text);
}

function say(text, channel) {

	if (!channel) {
		// Grab first channel if not given
		channel = MAINCHAN;
	}

	CLIENT.say(channel, text);
 	
}

function botAddressed(text) {
	var msgBegin = text.substr(0, BOTNAME.length + 2)
	  , reg = new RegExp(BOTNAME + "(,|:)");


	return reg.test(msgBegin);
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

function factsFound(facts, callback, to) {
	var num = facts.length;

	debug("Found " + num.toString() + " facts.");
   
	try {
		// Either way use 'to' to send tidbit to the channel that the fact
		// was requested on
		if (num > 1) {
			var useNum = Math.floor((Math.random() * num));

			debug("Attempting to access #" + useNum.toString());
			
			callback(facts[useNum].tidbit, to);
		} else {
			callback(facts[0].tidbit, to);
		}
	} catch (err) {
		warn("Uncaught error when a fact was found, reason: " + err.toString());
		warn(err.stack);
	}
}

function factsNotFound(reason) {
	warn("Fact not found, reason: " + reason);
	FACTS.find({fact: "don't know"}, function(err, all_facts) {
		if (err || all_facts.length === 0) {
			var errmsg = "No facts found for the 'don\'t know' fact. Did you forget to run sample.sql?";

			error(errmsg);
			throw error(errmsg);
		}

		var pickFact = Math.floor((Math.random() * all_facts.length));

		say(all_facts[pickFact].tidbit, MAINCHAN);
	});
}

function dbFind(text, callback, to) {
	FACTS.find({ fact: text },
		function(err, all_facts) {

			// As long as we find a fact in the db when someone says 
			// something, we'll repeat it. Otherwise, just keep quiet
			if (!err && all_facts.length > 0) {
				factsFound(all_facts, callback, to);
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
			dbFind("failresponse", say);

		default:
			// Basic bot key phrase response insertion

			break;

	}
	if (returned != 'none') {
		dbInsert(result[0], result[1], "<reply>", 0, 0, say);
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

function onIRCPriv(from, text) {
	debug("Pm received: " + text);
}

function onIRCMsg(from, to, text, message) {
	if (to === BOTNAME) {
		onIRCPriv(from, text);
		return;
	}

	if (text.length > MAXTLEN) {

		try {
				// Database Command detection
				// If the beginning of the text is the bot's name, then send to command sequence
				if (botAddressed(text)) {
					debug("Bot was addressed directly.");

					dbCommand(text.substr(ircConfig.config.botName.length+2));
					// TODO Temporary logging of data, may be removed in production
					say("Finished with command stuff", to);
				
				} else {
					// Standard trigger lookup
					dbFind(text, say, to);
				}
		}
		catch(err) {
			// TODO Temporary logging of data, may be removed in production
			warn("Fail in connect: " + err.message);
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

	if (!config.channels || config.channels.length === 0) {
		error("No channels specified to connect to.");

		process.exit(1);
	}

	debug("Attempting to connect to IRC...");

	var client = new irc.Client(
		config.server,
		config.botName, 
		{ channels: config.channels}
	);

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
		error("Uncaught exception in top-level try-except, error: " + err);
		error(err.stack);
	}
}

main();
