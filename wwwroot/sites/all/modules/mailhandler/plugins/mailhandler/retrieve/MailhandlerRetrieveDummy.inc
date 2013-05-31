<?php
/**
 * @file
 * MailhandlerRetrieveDummy class.
 */

$plugin = array(
  'name' => 'Dummy library',
  'description' => 'Does absolutely nothing. For testing purposes only.',
  'handler' => array(
    'class' => 'MailhandlerRetrieveDummy',
    'parent' => 'MailhandlerRetrieve',
  ),
  'file' => 'MailhandlerRetrieveDummy.class.php',
);
