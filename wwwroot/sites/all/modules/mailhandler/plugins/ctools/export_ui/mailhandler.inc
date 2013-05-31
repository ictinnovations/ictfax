<?php
/**
 * @file
 * Allows Mailhandler Mailboxes to be exported.
 */

$plugin = array(
  'schema' => 'mailhandler_mailbox',
  'access' => 'administer mailhandler',
  'menu' => array(
    'menu prefix' => 'admin/structure',
    'menu item' => 'mailhandler',
    'menu title' => 'Mailhandler Mailboxes',
    'menu description' => 'Administer mailhandler mailboxes.',
    'items' => array(
      'test' => array(
        'path' => 'list/%ctools_export_ui/test',
        'title' => 'Test connection',
        'page callback' => 'ctools_export_ui_switcher_page',
        'page arguments' => array('mailhandler', 'test', 4),
        'load arguments' => array('mailhandler'),
        'file' => 'includes/export-ui.inc',
        'file path' => drupal_get_path('module', 'ctools'),
        'access arguments' => array('administer mailhandler'),
        'type' => MENU_CALLBACK,
      ),
    )
  ),
  'title singular' => t('mailhandler mailbox'),
  'title singular proper' => t('Mailhandler Mailbox'),
  'title plural' => t('mailhandler mailboxes'),
  'title plural proper' => t('Mailhandler Mailboxes'),
  'handler' => array(
    'class' => 'mailhandler_mailbox_ui',
    'parent' => 'ctools_export_ui',
  ),
  'allowed operations' => array(
    'test' => array('title' => t('Test connection'), 'ajax' => TRUE, 'token' => TRUE),
  ),
  'file' => 'mailhandler_mailbox_ui.class.php',
);
