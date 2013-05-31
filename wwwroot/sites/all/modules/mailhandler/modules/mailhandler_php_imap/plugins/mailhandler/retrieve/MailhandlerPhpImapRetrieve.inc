<?php
/**
 * @file
 * MailhandlerPhpImapRetrieve class.
 */

$plugin = array(
  'name' => 'PHP IMAP',
  'description' => 'Uses the PHP IMAP library (imap_ functions) to retrieve messages from IMAP and POP mailboxes',
  'handler' => array(
    'class' => 'MailhandlerPhpImapRetrieve',
    'parent' => 'MailhandlerRetrieve'
  ),
  'file' => 'MailhandlerPhpImapRetrieve.class.php',
);
