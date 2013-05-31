<?php
/**
 * @file
 * MailhandlerCommandsDefault class.
 */

$plugin = array(
  'name' => 'Default commands processor',
  'description' => 'Default Mailhandler command parser and processor for nodes',
  'handler' => array(
    'class' => 'MailhandlerCommandsDefault',
    'parent' => 'MailhandlerCommands',
  ),
  'file' => 'MailhandlerCommandsDefault.class.php',
);
