<?php
/**
 * @file
 * Defines mailhandler_nodes importer.
 */

/**
 * Implements hook_feeds_importer_default().
 */
function mailhandler_default_feeds_importer_default() {
  $export = array();

  $feeds_importer = new stdClass;
  $feeds_importer->disabled = FALSE; /* Edit this to true to make a default feeds_importer disabled initially */
  $feeds_importer->api_version = 1;
  $feeds_importer->id = 'mailhandler_nodes';
  $feeds_importer->config = array(
    'name' => 'Mailhandler nodes',
    'description' => 'Imports nodes from a Mailhandler mailbox',
    'fetcher' => array(
      'plugin_key' => 'MailhandlerFetcher',
      'config' => array(
        'filter' => 'MailhandlerFiltersNodes',
      ),
    ),
    'parser' => array(
      'plugin_key' => 'MailhandlerParser',
      'config' => array(
        'default_commands' => 'status: 1',
        'commands_failed_auth' => 'status: 0',
        'command_plugin' => array(
          'MailhandlerCommandsDefault' => 'MailhandlerCommandsDefault',
          'MailhandlerCommandsHeaders' => 'MailhandlerCommandsHeaders',
          'MailhandlerCommandsFiles' => 'MailhandlerCommandsFiles',
        ),
        'authenticate_plugin' => 'MailhandlerAuthenticateDefault',
        'available_commands' => 'status',
      ),
    ),
    'processor' => array(
      'plugin_key' => 'FeedsFaxProcessor',
      'config' => array(
        'content_type' => 'fax',
        'expire' => '-1',
        'author' => 0,
        'mappings' => array(
          0 => array(
            'source' => 'subject',
            'target' => 'title',
            'unique' => FALSE,
          ),
          1 => array(
            'source' => 'authenticated_uid',
            'target' => 'uid',
            'unique' => FALSE,
          ),
          2 => array(
            'source' => 'status',
            'target' => 'status',
            'unique' => FALSE,
          ),
          3 => array(
            'source' => 'body_text',
            'target' => 'body',
            'unique' => FALSE,
          ),
          4 => array(
            'source' => 'message_id',
            'target' => 'guid',
            'unique' => 1,
          ),
          5 => array(
            'source' => 'fromaddress',
            'target' => 'field_from',
            'unique' => FALSE,
          ),
          6 => array(
            'source' => 'toaddress',
            'target' => 'field_to',
            'unique' => FALSE,
          ),
          7 => array(
            'source' => 'attachments',
            'target' => 'field_file',
            'unique' => FALSE,
          ),
        ),
        'update_existing' => '0',
        'input_format' => 'plain_text',
      ),
    ),
    'content_type' => 'mailhandler_source',
    'update' => 0,
    'import_period' => '0',
    'expire_period' => 3600,
    'import_on_create' => 1,
    'process_in_background' => 0,
  );
  $export['mailhandler_nodes'] = $feeds_importer;

  return $export;
}
