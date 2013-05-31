<?php

/**
 * Implements hook_field_views_data().
 */
function addressfield_field_views_data($field) {
  $data = field_views_field_default_views_data($field);

  // Add a handler for countries.
  foreach ($field['storage']['details']['sql'] as $type => $tables) {
    foreach ($tables as $table_name => $columns) {
      if (!isset($columns['country'])) {
        continue;
      }
      
      $column_real_name = $columns['country'];
      if (!isset($data[$table_name][$column_real_name]['filter'])) {
        continue;
      }

      $data[$table_name][$column_real_name]['filter']['handler'] = 'addressfield_views_handler_filter_country';
    }
  }

  return $data;
}
