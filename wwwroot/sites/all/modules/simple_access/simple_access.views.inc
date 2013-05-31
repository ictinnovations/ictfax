<?php
/**
 * @file
 * Provide Simple Access security method for views.
 */

/**
 * Implements hook_views_plugins().
 */
function simple_access_views_plugins() {
  return array(
    'access' => array(
      'simple_access' => array(
        'title' => t('Simple access group'),
        'help' => t('Will only make the views available if the user is apart of the specificed group.'),
        'handler' => 'simple_access_views_plugin_group',
        'uses options' => TRUE,
        'path' => drupal_get_path('module', 'simple_access') . '/views',
      ),
    ),
  );
}