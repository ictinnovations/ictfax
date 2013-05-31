<?php
/**
 * @file
 * MailhandlerCommandsFiles class.
 */

$plugin = array(
  'name' => 'Files processor',
  'description' => 'Provides file attachments as a mapping source.',
  'handler' => array(
    'class' => 'MailhandlerCommandsFiles',
    'parent' => 'MailhandlerCommands',
  ),
  'file' => 'MailhandlerCommandsFiles.class.php',
  'weight' => 20,
);
