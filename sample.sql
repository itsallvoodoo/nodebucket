INSERT INTO `bucket_facts` (`fact`, `tidbit`, `verb`, `RE`, `protected`, `mood`, `chance`) VALUES
('band name reply', '"$band" would be a good name for a band.', '<reply>', 0, 1, NULL, NULL),
('band name reply', '"$band" would be a nice name for a band.', '<reply>', 0, 1, NULL, NULL),
('band name reply', '"$band" would be a nice name for a rock band.', '<reply>', 0, 1, NULL, NULL),
('band name reply', '"$band" would make a good name for a band.', '<reply>', 0, 1, NULL, NULL),
('band name reply', '"$band" would make a good name for a rock band.', '<reply>', 0, 1, NULL, NULL),
('band name reply', 'That would be a good name for a band.', '<reply>', 0, 1, NULL, NULL),
('tumblr name reply', 'http://$band.tumblr.com/', '<reply>', 0, 1, NULL, NULL),
('don''t know', 'A thousand apologies, effendi, but I do not understand.', '<reply>', 0, 1, NULL, NULL),
('don''t know', 'Beeeeeeeeeeeeep!', '<reply>', 0, 1, NULL, NULL),
('don''t know', 'Can''t talk, zombies!', '<reply>', 0, 1, NULL, NULL),
('don''t know', 'Error 42: Factoid not in database.  Please contact administrator of current universe.', '<reply>', 0, 1, NULL, NULL),
('don''t know', 'Error at 0x08: Reference not found', '<reply>', 0, 1, NULL, NULL),
('don''t know', 'I cannot access that data.', '<reply>', 0, 1, NULL, NULL),
('don''t know', 'I do not know.', '<reply>', 0, 1, NULL, NULL),
('don''t know', 'I don''t know', '<reply>', 0, 1, NULL, NULL),
('don''t know', 'I don''t know anything about that.', '<reply>', 0, 1, NULL, NULL),
('don''t know', 'I''m sorry, there''s currently nothing associated with that keyphrase.', '<reply>', 0, 1, NULL, NULL),
('don''t know', 'Not a bloody clue, sir.', '<reply>', 0, 1, NULL, NULL),
('don''t know', 'UNCAUGHT EXCEPTION: TERMINATING', '<reply>', 0, 1, NULL, NULL),
('drops item', 'fumbles and drops $giveitem.', '<action>', 0, 0, NULL, NULL),
('duplicate item', '$who: I already have $item.', '<reply>', 0, 1, NULL, NULL),
('duplicate item', 'But I''ve already got $item!', '<reply>', 0, 1, NULL, NULL),
('duplicate item', 'I already have $item.', '<reply>', 0, 1, NULL, NULL),
('duplicate item', 'No thanks, $who, I''ve already got one.', '<reply>', 0, 1, NULL, NULL),
('list items', 'contains $inventory.', '<action>', 0, 0, NULL, NULL),
('list items', 'I am carrying $inventory.', '<reply>', 0, 0, NULL, NULL),
('list items', 'is carrying $inventory.', '<action>', 0, 0, NULL, NULL),
('pickup full', 'drops $giveitem and takes $item.', '<action>', 0, 1, NULL, NULL),
('pickup full', 'hands $who $giveitem in exchange for $item', '<action>', 0, 1, NULL, NULL),
('pickup full', 'is now carrying $item, but dropped $giveitem.', '<action>', 0, 1, NULL, NULL),
('takes item', 'is now carrying $item.', '<action>', 0, 1, NULL, NULL),
('takes item', 'now contains $item.', '<action>', 0, 1, NULL, NULL),
('takes item', 'Okay, $who.', '<reply>', 0, 1, NULL, NULL);

INSERT INTO `bucket_items` (`channel`, `what`, `user`) VALUES
('#sample', 'the Creature', 'the Black Lagoon'),
('#sample', 'two turtle doves', 'Puddle'),
('#sample', 'three french hens', 'Puddle'),
('#sample', 'four calling birds', 'Puddle'),
('#sample', 'five golden rings', 'Puddle'),
('#sample', 'six geese a-laying', 'Puddle'),
('#sample', 'seven swans a-swimming', 'Puddle'),
('#sample', 'eight maids a-milking', 'Puddle'),
('#sample', 'nine ladies dancing', 'Puddle'),
('#sample', 'a comeback', 'QwerkyOne'),
('#sample', 'a nice ass-car', 'QwerkyOne'),
('#sample', 'the root password', 'QwerkyOne'),
('#sample', 'a dirty bucket', 'QwerkyOne'),
('#sample', 'a magic wand', 'QwerkyOne'),
('#sample', 'a headcrab', 'Jekotia'),
('#sample', '42 hikers a-hitching', 'QwerkyOne');

INSERT INTO `bucket_vars` (`id`, `name`, `perms`, `type`) VALUES
(901, 'verb', 'read-only', 'verb'),
(902, 'noun', 'read-only', 'noun'),
(903, 'adjective', 'read-only', 'var'),
(904, 'digit', 'read-only', 'var'),
(905, 'preposition', 'read-only', 'var'),
(906, 'color', 'read-only', 'var'),
(907, 'article', 'read-only', 'var'),
(908, 'weekday', 'read-only', 'var'),
(909, 'band', 'read-only', 'var');

INSERT INTO `bucket_values` (`var_id`, `value`) VALUES
(901, 'hug'),
(901, 'kiss'),
(901, 'listen'),
(901, 'run'),
(901, 'shriek'),
(901, 'sleep'),
(901, 'smash'),
(901, 'talk'),
(901, 'walk'),
(902, 'acid'),
(902, 'acorn'),
(902, 'bacon'),
(902, 'battery'),
(902, 'beef'),
(902, 'cake'),
(902, 'comic'),
(902, 'device'),
(902, 'factoid'),
(902, 'galaxy'),
(902, 'idea'),
(902, 'magic'),
(902, 'mindjail'),
(902, 'phone'),
(902, 'potato'),
(902, 'salami'),
(902, 'shirt'),
(902, 'sword'),
(902, 'tooth'),
(902, 'wrench'),
(903, 'adorable'),
(903, 'cold'),
(903, 'fast'),
(903, 'fuzzy'),
(903, 'gigantic'),
(903, 'hairless'),
(903, 'hairy'),
(903, 'hot'),
(903, 'huge'),
(903, 'iridescent'),
(903, 'lukewarm'),
(903, 'moldy'),
(903, 'repulsive'),
(903, 'rough'),
(903, 'royal'),
(903, 'sharp'),
(903, 'shiny'),
(903, 'slow'),
(903, 'smelly'),
(903, 'smooth'),
(903, 'sparkly'),
(903, 'spicy'),
(903, 'spikey'),
(903, 'spooky'),
(903, 'squishy'),
(903, 'sticky'),
(903, 'tangy'),
(903, 'tiny'),
(903, 'warm'),
(903, 'windy'),
(903, 'wonky'),
(904, '0'),
(904, '1'),
(904, '2'),
(904, '3'),
(904, '4'),
(904, '5'),
(904, '6'),
(904, '7'),
(904, '8'),
(904, '9'),
(905, 'across'),
(905, 'behind'),
(905, 'between'),
(905, 'excluding'),
(905, 'near'),
(905, 'opposite'),
(905, 'over'),
(905, 'regarding'),
(905, 'under'),
(905, 'upon'),
(905, 'via'),
(905, 'within'),
(906, 'blue'),
(906, 'cerulean'),
(906, 'chartreuse'),
(906, 'indigo'),
(906, 'mahogany'),
(906, 'maroon'),
(906, 'octarine'),
(906, 'plum'),
(906, 'puce'),
(906, 'red'),
(906, 'saffron'),
(906, 'teal'),
(907, 'a'),
(907, 'the'),
(908, 'Friday'),
(908, 'Monday'),
(908, 'Saturday'),
(908, 'Sunday'),
(908, 'Thursday'),
(908, 'Tuesday'),
(908, 'Wednesday'),
(909, 'The Simple Sounds'),
(909, 'Wobbly Tunes');
