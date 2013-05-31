<?php

/**
 * @file
 * Mapper that exposes a node's taxonomy vocabularies as mapping targets.
 */

/**
 * Implements hook_feeds_parser_sources_alter().
 *
 * @todo: Upgrade to 7.
 */
function taxonomy_feeds_parser_sources_alter(&$sources, $content_type) {
  if (!empty($content_type)) {
    foreach (taxonomy_get_vocabularies($content_type) as $vocabulary) {
      $sources['parent:taxonomy:' . $vocabulary->machine_name] = array(
        'name' => t('Feed node: Taxonomy: @vocabulary', array('@vocabulary' => $vocabulary->name)),
        'description' => t('Taxonomy terms from feed node in given vocabulary.'),
        'callback' => 'taxonomy_feeds_get_source',
      );
    }
  }
}

/**
 * Callback, returns taxonomy from feed node.
 */
function taxonomy_feeds_get_source(FeedsSource $source, FeedsParserResult $result, $key) {
  if ($node = node_load($source->feed_nid)) {
    $terms = taxonomy_node_get_terms($node);
    $vocabularies = taxonomy_vocabulary_load_multiple(array(), array('machine_name' => str_replace('parent:taxonomy:', '', $key)));
    $vocabulary = array_shift($vocabularies);
    $result = array();
    foreach ($terms as $tid => $term) {
      if ($term->vid == $vocabulary->vid) {
        $result[] = new FeedsTermElement($term);
      }
    }
    return $result;
  }
}

/**
 * Implements hook_feeds_processor_targets_alter().
 */
function taxonomy_feeds_processor_targets_alter(&$targets, $entity_type, $bundle_name) {
  foreach (field_info_instances($entity_type, $bundle_name) as $name => $instance) {
    $info = field_info_field($name);
    if ($info['type'] == 'taxonomy_term_reference') {
      $targets[$name] = array(
        'name' => check_plain($instance['label']),
        'callback' => 'taxonomy_feeds_set_target',
        'description' => t('The @label field of the node.', array('@label' => $instance['label'])),
      );
    }
  }
}

/**
 * Callback for mapping. Here is where the actual mapping happens.
 *
 * @todo Do not create new terms for non-autotag fields.
 */
function taxonomy_feeds_set_target($source, $entity, $target, $terms) {
  if (empty($terms)) {
    return;
  }

  // Handle non-multiple values.
  if (!is_array($terms)) {
    $terms = array($terms);
  }

  $info = field_info_field($target);

  // See http://drupal.org/node/881530
  if (isset($info['settings']['allowed_values'][0]['vocabulary'])) {
    $vocabulary = taxonomy_vocabulary_machine_name_load($info['settings']['allowed_values'][0]['vocabulary']);
  }
  else {
    $vocabulary = taxonomy_vocabulary_load($info['settings']['allowed_values'][0]['vid']);
  }

  $i = 0;
  $entity->$target = isset($entity->$target) ? $entity->$target : array();
  foreach ($terms as $term) {
    $tid = 0;
    if ($term instanceof FeedsTermElement) {
      $tid = $term->tid;
    }
    elseif (is_numeric($term)) {
      $tid = $term;
    }
    elseif (is_string($term)) {
      $tid = taxonomy_term_check_term($term, $vocabulary->vid);
    }
    if ($tid) {
      $entity->{$target}['und'][$i]['tid'] = $tid;
    }

    if ($info['cardinality'] == 1) {
      break;
    }
    $i++;
  }
}

/**
 * Checks whether a term identified by name and vocabulary exists. Creates a
 * new term if it does not exist.
 *
 * @param $name
 *   A term name.
 * @param $vid
 *   A vocabulary id.
 *
 * @return
 *   A term id.
 */
function taxonomy_term_check_term($name, $vid) {
  $name = trim($name);
  $term = taxonomy_term_lookup_term($name, $vid);
  if (empty($term)) {
    $term = new stdClass();
    $term->name = $name;
    $term->vid = $vid;
    taxonomy_term_save($term);
    return $term->tid;
  }
  return $term->tid;
}

/**
 * Looks up a term, assumes SQL storage backend.
 */
function taxonomy_term_lookup_term($name, $vid) {
  return db_select('taxonomy_term_data', 'td')
    ->fields('td', array('tid', 'name'))
    ->condition('name', $name)
    ->condition('vid', $vid)
    ->execute()
    ->fetchObject();
}
