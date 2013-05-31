<?php

/**
 * @file
 * Administrative functions / callbacks.
 */

/**
 * Menu callback for generating a countries settings admin form.
 */
function countries_configuration_options_form($form, &$form_state, $country, $name) {
  $config_options = countries_configuration_options();
  if (!isset($config_options[$name])) {
    drupal_access_denied();
    return;
  }

  $info = $config_options[$name];

  $form_state['is_update'] = db_select('countries_data', 'cd')
        ->fields('cd', array('iso2'))
        ->condition('iso2', $country->iso2)
        ->condition('name', $name)
        ->execute()
        ->fetchCol();

  if (!empty($info['file'])) {
    $file_path = empty($info['file path']) ? drupal_get_path('module', $info['module']) : $info['file path'];
    require_once DRUPAL_ROOT . '/' . $file_path . '/' . $item['file'];
  }

  if (isset($info['title callback']) && $title = $info['title callback']($country)) {
    drupal_set_title($title);
  }

  $form = array('#tree' => TRUE);
  if (!empty($info['help'])) {
    $form['help'] = array(
      '#markup' => '<p>' . $info['help'] . '</p>',
    );
  }
  $form['iso2'] = array(
    '#type' => 'value',
    '#value' => $country->iso2,
  );
  $form['module'] = array(
    '#type' => 'value',
    '#value' => $info['module'],
  );
  $form['name'] = array(
    '#type' => 'value',
    '#value' => $name,
  );

  $values = countries_load_configuration_options($country, $name);
  $form['data'] = $info['form callback']($country, $values, $form);

  $form['reset'] = array(
    '#type' => 'submit',
    '#value' => t('Reset'),
    '#submit' => array('countries_configuration_options_form_reset_submit'),
  );
  $form['submit'] = array(
    '#type' => 'submit',
    '#value' => t('Save'),
    '#submit' => array('countries_configuration_options_form_save_submit'),
  );

  return $form;
}

/**
 * Reset submit handler for countries_configuration_options_form().
 *
 * This saves an empty array() to the database, resulting in the default values
 * being loaded when the record is loaded again.
 */
function countries_configuration_options_form_reset_submit($form, &$form_state) {
  // This will reset to the default settings on load.
  $form_state['values']['data'] = array();
  drupal_write_record('countries_data', $form_state['values'], $form_state['is_update'] ? 'iso2' : array());
}

/**
 * Standard save submit handler for countries_configuration_options_form().
 */
function countries_configuration_options_form_save_submit($form, &$form_state) {
  drupal_write_record('countries_data', $form_state['values'], $form_state['is_update'] ? 'iso2' : array());
}
