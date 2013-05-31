<?php
/**
 * @file
 * mailhandler_default.strongarm.inc
 */

/**
 * Implements hook_strongarm().
 */
function mailhandler_default_strongarm() {
  $export = array();

  $strongarm = new stdClass;
  $strongarm->disabled = FALSE; /* Edit this to true to make a default strongarm disabled initially */
  $strongarm->api_version = 1;
  $strongarm->name = 'comment_anonymous_mailhandler_source';
  $strongarm->value = 0;
  $export['comment_anonymous_mailhandler_source'] = $strongarm;

  $strongarm = new stdClass;
  $strongarm->disabled = FALSE; /* Edit this to true to make a default strongarm disabled initially */
  $strongarm->api_version = 1;
  $strongarm->name = 'comment_default_mode_mailhandler_source';
  $strongarm->value = 1;
  $export['comment_default_mode_mailhandler_source'] = $strongarm;

  $strongarm = new stdClass;
  $strongarm->disabled = FALSE; /* Edit this to true to make a default strongarm disabled initially */
  $strongarm->api_version = 1;
  $strongarm->name = 'comment_default_per_page_mailhandler_source';
  $strongarm->value = '50';
  $export['comment_default_per_page_mailhandler_source'] = $strongarm;

  $strongarm = new stdClass;
  $strongarm->disabled = FALSE; /* Edit this to true to make a default strongarm disabled initially */
  $strongarm->api_version = 1;
  $strongarm->name = 'comment_form_location_mailhandler_source';
  $strongarm->value = 1;
  $export['comment_form_location_mailhandler_source'] = $strongarm;

  $strongarm = new stdClass;
  $strongarm->disabled = FALSE; /* Edit this to true to make a default strongarm disabled initially */
  $strongarm->api_version = 1;
  $strongarm->name = 'comment_mailhandler_source';
  $strongarm->value = '0';
  $export['comment_mailhandler_source'] = $strongarm;

  $strongarm = new stdClass;
  $strongarm->disabled = FALSE; /* Edit this to true to make a default strongarm disabled initially */
  $strongarm->api_version = 1;
  $strongarm->name = 'comment_preview_mailhandler_source';
  $strongarm->value = '1';
  $export['comment_preview_mailhandler_source'] = $strongarm;

  $strongarm = new stdClass;
  $strongarm->disabled = FALSE; /* Edit this to true to make a default strongarm disabled initially */
  $strongarm->api_version = 1;
  $strongarm->name = 'comment_subject_field_mailhandler_source';
  $strongarm->value = 1;
  $export['comment_subject_field_mailhandler_source'] = $strongarm;

  $strongarm = new stdClass;
  $strongarm->disabled = FALSE; /* Edit this to true to make a default strongarm disabled initially */
  $strongarm->api_version = 1;
  $strongarm->name = 'menu_options_mailhandler_source';
  $strongarm->value = array(
    0 => 'main-menu',
  );
  $export['menu_options_mailhandler_source'] = $strongarm;

  $strongarm = new stdClass;
  $strongarm->disabled = FALSE; /* Edit this to true to make a default strongarm disabled initially */
  $strongarm->api_version = 1;
  $strongarm->name = 'menu_parent_mailhandler_source';
  $strongarm->value = 'main-menu:0';
  $export['menu_parent_mailhandler_source'] = $strongarm;

  $strongarm = new stdClass;
  $strongarm->disabled = FALSE; /* Edit this to true to make a default strongarm disabled initially */
  $strongarm->api_version = 1;
  $strongarm->name = 'node_options_mailhandler_source';
  $strongarm->value = array(
    0 => 'status',
  );
  $export['node_options_mailhandler_source'] = $strongarm;

  $strongarm = new stdClass;
  $strongarm->disabled = FALSE; /* Edit this to true to make a default strongarm disabled initially */
  $strongarm->api_version = 1;
  $strongarm->name = 'node_preview_mailhandler_source';
  $strongarm->value = '0';
  $export['node_preview_mailhandler_source'] = $strongarm;

  $strongarm = new stdClass;
  $strongarm->disabled = FALSE; /* Edit this to true to make a default strongarm disabled initially */
  $strongarm->api_version = 1;
  $strongarm->name = 'node_submitted_mailhandler_source';
  $strongarm->value = 1;
  $export['node_submitted_mailhandler_source'] = $strongarm;

  return $export;
}
