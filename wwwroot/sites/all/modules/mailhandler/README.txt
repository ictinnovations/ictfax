CONTENTS OF THIS FILE
---------------------

 * Overview
 * Features
 * What's new in Mailhandler 2.x
 * More documentation

OVERVIEW
--------

The Mailhandler module allows registered users to create or edit nodes and
comments via email. Authentication is usually based on the From: email address.
Users may post taxonomy terms, teasers, and other node parameters using the
Commands capability.

FEATURES
--------

- Retrieve mail from any IMAP / POP3 mailbox using a variety of settings, and
  export/import mailbox configurations using CTools / Features.
- Extensible authentication system- authenticate users by matching "from"
  address to Drupal user accounts, or by using more advanced token- and
  password-based authentication methods
- Extensible commands system- set fields using a simple key: value system, or
  use more complex command plugins.
- Filters allow you to strip signatures and other cruft from messages.

WHAT'S NEW IN MAILHANDLER 2.X
-----------------------------

Mailhandler 2.x is a redesign and rewrite of the architecture of Mailhander
1.x, aiming to be more extensible with how a message can be handled.
Mailhandler 2.x also leans on other frameworks where possible in order to
reduce the amount of code that lives in Mailhandler itself when that code 
consists of patterns better provided by other library or framework modules.

In hard terms, here's what's new in Mailhandler 2.x:

- Uses CTools Export UI plugins to handle mailbox management, including
  creating, editing, deleting, cloning, exporting, and importing mailbox
  configurations.
- Integration with the Feeds module to handle fetching, parsing, and processing 
  messages in IMAP and POP mailboxes. Feeds integration also helps with 
  scheduling processing times.  You can write your own message fetcher, parser,
  or processor if you'd like to handle messages in a custom way.
- CTools Plugin system is also used to allow custom command and authentication 
  plugins to be written. For instance, commanding of basic (textual) fields is
  supported, but you could write a plugin to command more complex field types.
- Some business logic remains the same, such as the main mailhandler mailbox 
  retrieval library in mailhandler.retrieve.inc
- The message cleaners have been converted into input filters, so they don't
  permanently modify message content before it is stored in the database.

MORE DOCUMENTATION
------------------

See the INSTALL.txt for setup instructions.

More documentation is located at http://drupal.org/handbook/modules/mailhandler
which discusses topics such as how to configure mailboxes for specific email
providers.
