<?php
/**
 * @file
 * MailhandlerAuthenticateTokenauth class.
 */

$plugin = array(
  'name' => '"Tokenauth" address authentication',
  'description' => 'Authenticate messages based on tokens from Tokenauth',
  'handler' => array(
    'class' => 'MailhandlerAuthenticateTokenauth',
    'parent' => 'MailhandlerAuthenticate',
  ),
  'file' => 'MailhandlerAuthenticateTokenauth.class.php',
);
