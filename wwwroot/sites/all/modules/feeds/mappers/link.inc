<?php

/**
 * @file
 * On behalf implementation of Feeds mapping API for link.module.
 */

/**
 * Implements hook_feeds_processor_targets_alter().
 *
 * @see FeedsNodeProcessor::getMappingTargets().
 */
function link_feeds_processor_targets_alter(&$targets, $entity_type, $bundle_name) {
  foreach (field_info_instances($entity_type, $bundle_name) as $name => $instance) {
    $info = field_info_field($name);
    if ($info['type'] == 'link_field') {
      if (array_key_exists('url', $info['columns'])) {
        $targets[$name . ':url'] = array(
          'name' => t('@name URL', array('@name' => $instance['label'])),
          'callback' => 'link_feeds_set_target',
          'description' => t('The @label field of the node.', array('@label' => $instance['label'])),
        );
      }
      if (array_key_exists('title', $info['columns'])) {
        $targets[$name . ':title'] = array(
          'name' => t('@name Title', array('@name' => $instance['label'])),
          'callback' => 'link_feeds_set_target',
          'description' => t('The @label field of the node.', array('@label' => $instance['label'])),
        );
      }
    }
  }
}

/**
 * Callback for mapping. Here is where the actual mapping happens.
 *
 * When the callback is invoked, $target contains the name of the field the
 * user has decided to map to and $value contains the value of the feed item
 * element the user has picked as a source.
 */
function link_feeds_set_target($source, $entity, $target, $value) {
  if (empty($value)) {
    return;
  }

  // Handle non-multiple value fields.
  if (!is_array($value)) {
    $value = array($value);
  }

  // Iterate over all values.
  $i = 0;
  $info = field_info_field($target);
  list($field_name, $sub_field) = explode(':', $target);
  foreach ($value as $v) {
    if (!is_array($v) && !is_object($v)) {
      if (strstr($target, 'url')) {
        if (isset($entity->{$field_name}['und'][$i]['title'])) {
          $field['und'][$i]['title'] = $entity->{$field_name}['und'][$i]['title'];
        }
        $field['und'][$i]['url'] = $v;
      }
      elseif (strstr($target, 'title')) {
        if (isset($entity->{$field_name}['und'][$i]['url'])) {
          $field['und'][$i]['url'] = $entity->{$field_name}['und'][$i]['url'];
        }
        $field['und'][$i]['title'] = $v;
      }
    }
    if ($info['cardinality'] == 1) {
      break;
    }
    $i++;
  }
  $entity->{$field_name} = $field;
}
