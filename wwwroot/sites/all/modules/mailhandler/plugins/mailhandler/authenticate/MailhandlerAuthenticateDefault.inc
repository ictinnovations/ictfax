<?php
/**
 * @file
 * MailhandlerAuthenticateDefault class.
 */

$plugin = array(
  'name' => '"From" address authentication',
  'description' => 'Authenticate messages based on "from" email address',
  'handler' => array(
    'class' => 'MailhandlerAuthenticateDefault',
    'parent' => 'MailhandlerAuthenticate',
  ),
  'file' => 'MailhandlerAuthenticateDefault.class.php',
);
