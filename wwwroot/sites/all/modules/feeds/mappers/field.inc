<?php

/**
 * @file
 * On behalf implementation of Feeds mapping API for field.module.
 *
 * Does actually not include mappers for field types defined in fields module
 * (because there aren't any) but mappers for all fields that contain their
 * value simply in $entity->fieldname['und'][$i]['value'].
 */

/**
 * Implements hook_feeds_processor_targets_alter().
 *
 * @see FeedsNodeProcessor::getMappingTargets().
 */
function field_feeds_processor_targets_alter(&$targets, $entity_type, $bundle_name) {
  $numeric_types = array(
    'list_integer',
    'list_float',
    'list_boolean',
    'number_integer',
    'number_decimal',
    'number_float',
  );
  $string_types = array(
    'list_text',
    'text',
    'text_long',
    'text_with_summary',
  );
  foreach (field_info_instances($entity_type, $bundle_name) as $name => $instance) {
    $info = field_info_field($name);
    unset($callback);
    if (in_array($info['type'], $numeric_types)) {
      $callback = 'field_feeds_set_target_numeric';
    }
    if (in_array($info['type'], $string_types)) {
      $callback = 'field_feeds_set_target_text';
    }
    if (isset($callback)) {
      $targets[$name] = array(
        'name' => check_plain($instance['label']),
        'callback' => $callback,
        'description' => t('The @label field of the node.', array('@label' => $instance['label'])),
      );
    }
  }
}

/**
 * Callback for mapping numerics.
 *
 * Ensure that $value is a numeric to avoid database errors.
 */
function field_feeds_set_target_numeric($source, $entity, $target, $value) {
  if (!is_array($value)) {
    $value = array($value);
  }
  foreach ($value as $k => $v) {
    if (!is_numeric($v)) {
      unset($value[$k]);
    }
  }
  _field_feeds_set_target($source, $entity, $target, $value, FALSE);
}

/**
 * Callback for mapping text fields.
 */
function field_feeds_set_target_text($source, $entity, $target, $value) {
  if (!is_array($value)) {
    $value = array($value);
  }
  _field_feeds_set_target($source, $entity, $target, $value, TRUE);
}

/**
 * Helper for mapping.
 *
 * When the callback is invoked, $target contains the name of the field the
 * user has decided to map to and $value contains the value of the feed item
 * element the user has picked as a source.
 *
 * @param $source
 *   A FeedsSource object.
 * @param $entity
 *   The entity to map to.
 * @param $target
 *   The target key on $entity to map to.
 * @param $value
 *   The value to map. MUST be an array.
 * @param $input_format
 *   TRUE if an input format should be applied.
 */
function _field_feeds_set_target($source, $entity, $target, $value, $input_format = FALSE) {
  if (empty($value)) {
    return;
  }

  if ($input_format) {
    if (isset($source->importer->processor->config['input_format'])) {
      $format = $source->importer->processor->config['input_format'];
    }
  }

  $info = field_info_field($target);

  // Iterate over all values.
  $i = 0;
  $field = isset($entity->$target) ? $entity->$target : array();
  foreach ($value as $v) {
    if (!is_array($v) && !is_object($v)) {
      $field['und'][$i]['value'] = $v;
    }
    if ($input_format) {
      if (isset($format)) {
        $field['und'][$i]['format'] = $format;
      }
    }
    if ($info['cardinality'] == 1) {
      break;
    }
    $i++;
  }
  $entity->{$target} = $field;
}
