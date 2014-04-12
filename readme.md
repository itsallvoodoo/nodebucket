nodebukket
===========

Nodebukket is a re-imagining of xkcd's nodebukket irc bot, written in node!
The project is included here, with instructions for installation.

The database has not been added to the repository yet, but it will be eventually.

What is nodebukket?
---------------

Very similar to [xkcd-Bucket](https://github.com/zigdon/xkcd-nodebukket), nodebukket is a bot that can be
taught factoids that will be triggered when certain phrases are said. Not all of the features of Bucket
have been implemented, but that is a goal for this project. The following guide is a brief overview on 
how to get started, a full wiki is in the works.

In order to teach nodebukket, you must address him directly by saying "nodebukket, " + command, or whatever
you name your nodebukket. If you are on Freenode, nodebukket is already taken. Sorry I'm not sorry.

One of the important departures from the original nodebukket is the modularity of the project. Different features
can be used and managed via irc by adding custom modules. They will be in constant development; stay tuned.

Installing
----------

The following installation instructions are assuming you are using an ubuntu server.

1. Clone this repository.

2. Install javascript dependencies.
    First, install node. Detailed instructions can be found [here](http://howtonode.org/how-to-install-nodejs).
    `$ sudo apt-get install g++ curl libssl-dev apache2-utils`  
    `$ sudo apt-get install git-core`  
    `$ git clone git://github.com/ry/node.git`  
    `$ cd node`  
    `$ ./configure`  
    `$ make`  
    `$ sudo make install`  

    Second, install the modules needed by node. Navigate to the cloned repository and enter the following.
    `$ npm install irc`  
    `$ npm install mysql`  
    `$ npm install orm`  
    

2. Set up a MySQL database. Other databases have not been tested, attempt at your own risk.
    `$ sudo apt-get install mysql-server`
  *Replace this appropriately depending on your operating system.

3. Create the tables in nodebukket.sql. You may need the arguments `--user=root --password` in order for it
    to work.
    `$ mysqladmin create nodebukket`  
    `$ mysql -D nodebukket < nodebukket.sql`  
    `$ mysql -D nodebukket < sample.sql`  

4. Create a user for nodebukket, and grant all permissions on the nodebukket database.
    `$ echo 'grant all on nodebukket.* to nodebukket identified by "password"' | mysql`

5. TODO Configuration

6. TODO Stuff and things

7. Set nodebukket.js as executable.
    `$ chmod +x nodebukket.js`

8. Pre-flight checklist
  1. Register your nodebukket's nick with NickServ
  2. Register your nodebukket's logging and config channels, and configure them as private and restricted.
  3. Add your nodebukket's nick to the allow list for the logging and config channels. 

9. Start nodebukket.
    `$ node nodebukket.js`

10. Start adding factoids!

What can nodebukket do?
-------------------

The very basic functionality of nodebukket remains similar to xkcd Bucket.

### Factoids

#### X is Y

This is the most common and basic method of teaching nodebukket factoids, it is added by simply saying `X is Y`. 
If "X" is said later, nodebukket will reply with "X is Y". Be careful, though, as it is also easy to accidentally
create factoids this way.

`X is Y is Z` will be split between `X` and `Y`, and nodebukket will respond to the trigger "X" with "X is Y is Z."
`X is Y <is> Z` must be used for "X is Y" to trigger "X is Y is Z." See the section on <verb>s below.

#### X are Y

This is used identically to `X is Y`, with the exception being that nodebukket will respond to "X" with "X are Y."

#### X \<verb\> Y

nodebukket is smart enough to know verbs! `X loves Y` and similar phrases will cause X to trigger "X loves Y."

`X<'s> Y` is a special variant of this, making "X" trigger "X's Y."

#### X \<reply\> Y

Perhaps the second-most used factoids are `X <reply> Y` factoids. Saying "X" will make nodebukket respond "Y."

#### X \<action\> Y

This will make nodebukket use a `/me` when he replies. Thus, saying "X" will make nodebukket `/me Y`.

#### Commands

nodebukket is not a client! Teaching him factoids such as `Quit <reply> /quit` will not work as intended.

#### Quotes

TODO

nodebukket has the ability to remember things that users have said. `Remember {nick} {snippet_from_line}` will remember
that user's line under the trigger "nick quotes."

### Searching and Editing

#### Listing

TODO

`literal X` will list all the factoids associated with that trigger, separated by `|`. If there are too many, nodebukket
will automatically create a new page and append "*n* more." `literal[*p*] X` will list page number *p*.

`literal[*] X` will make nodebukket produce a URL of a text file with all of the associated factoids.

`X =~ /m/` will make nodebukket reply with the first factoid in trigger "X" containing "m."

"what was that?" will make nodebukket list the last spoken factoid with all of its details: "That was X(#000): <reply> Y", the
number being the factoid ID.

#### Editing

TODO

`X =~ s/m/n/` will replace "m" with "n" in the trigger "X." `X =~ s/m/n/i` (adding an "i" flag) will replace case-insensitively.
If there is more than one appearance of "m" in "X," it will replace the first instance. Channel operators can add a "g" flag to 
replace all.

`undo last` undoes the last change to a factoid. Non-ops can only `undo last` if they made the last change.

#### Variables

TODO

Variables will *only* work in responses. 

`$noun` and `$nouns` will add random noun(s) where they are placed.

`$verb`, `$verbed` and `$verbing` will do similarily with verbs.

`$adjective` and `$preposition` have similar effects.

`$who` will be replaced with the person who triggered the factoid, while `$someone` will choose a (semi-)random user.

`$to` will be replaced by the intended recipient, for example, `<someuser> anotherguy: blah blah` will replace $to with "anotherguy."

nodebukket also has gender variables (among other variables).

#### Inventory

TODO

Items can be put in nodebukket, given to nodebukket, or items given to nodebukket. nodebukket is also smart enough to understand posession, and will
add "username's item" appropriately. nodebukket's inventory can be listed with the command `inventory`.

Ops can delete items using `detailed inventory` and `delete item #x`.

`$item`, `$giveitem`, and `$newitem` are all variables concerning items. `$item` will use an item in nodebukket's inventory, `$giveitem` will
use an item and discard it, and `$newitem` will use a random item from previously learned items.

#### Special Factoids

TODO
nodebukket also has some factoids for hard-coded uses. These include "Don't Know", "Automatic Haiku" and "Band Name Reply."

#### Contacting

Please contact itsallvoodoo for any bugs, issues, suggestions, or questions. I am looking for active developers, so don't be afraid to fork
it and improve nodebukket! Many thanks go out to [zigdon](https://github.com/zigdon) for sharing the original inspiration for this irc bot.
