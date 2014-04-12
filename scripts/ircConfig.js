/*
* name:     config.js
* author:   Chad Hobbs
* created:  140327
*
* description: Configuration script for nodebukket
*/

// Configuration Object
var config = {
    // For Channels, first must be command/control, second+ is public
	channels: ["#yourControlChannel","#yourPublicChannel","#yourLoggingChannel"],
	server: "irc.freenode.net",
	botName: "nodebukket",
    port: 6667,
    debug: false,
    showErrors: false,
    autoRejoin: true,
    autoConnect: true,
    secure: false,
    selfSigned: false,
    certExpired: false,
    floodProtection: false,
    floodProtectionDelay: 1000,
    sasl: false,
    stripColors: false,
    // channelPrefixes: "&#",
    messageSplit: 512
};

exports.config = config;