<?php

/**
 * @file
 * An overview of the hooks that this module provides.
 */

/**
 * Provides the form settings for integrating with the countries configuration
 * module.
 *
 * This API allows multiple forms per module.
 */
function hook_countries_configuration_options() {
  $items = array(
    // This should be an unique key for this option. To avoid conflicts with
    // other modules, use, or prefix with, the modules name.
    'address' => array(
      // This provides the tab title when editting the form.
      'title' => t('Addresses'),
      // This should provide the form of elements that you want to save.
      'form callback' => 'example_address_country_admin_form',
      // Optional: Provides a better title for the page edit.
      'title callback' => 'example_address_country_admin_form_title',
      // Required: Used when no data exists or when reseting the country data.
      'default values' => array(
        'labels' => array(),
      ),
      // Optional: Includes this title before any callbacks are executed.
      'file' => 'address.admin.inc',
      // Optional: The path to the included file if not in the base module directory.
      'file path' => drupal_get_path('module', 'address') . '/includes',
      // Optional: Provides a help section to forms.
      'help' => t('This form allows you to set country specific configuration options for all address fields. Leave these blank to use the field defaults. Available address components are determined by the field settings.'),
    ),
  );
  $components = address_field_components();
  $items['address']['default values']['labels'] += array_combine(array_keys($components), array_fill(0, count($components), ''));

  return $items;
}

/**
 * An example form callback provided by hook_countries_configuration_options().
 *
 * @param object $country
 *   The country that is being edited.
 * @param array $values
 *   The existing values from the database or from the default settings.
 * @param array $form
 *   A reference to the base form if required.
 *   You can use this to append your own form data that is not maintained by
 *   this module. You will of course need to provide submit handles, et al, to
 *   maintain this data yourself.
 *
 * @return array
 *   The form structure of the additional form fields.
 */
function example_address_country_admin_form($country, $values, &$form) {
  foreach (address_field_components() as $key => $info) {
    $form['labels'][$key] = array(
      '#type' => 'textfield',
      '#title' => t('Label for !title', array('!title' => $info['name'])),
      '#default_value' => $values['labels'][$key],
    );
  }

  return $form;
}

/**
 * An example title callback provided by hook_countries_configuration_options().
 *
 * @param object $country
 *   The country that is being edited.
 *
 * @return string
 *   The page title to display.
 *   This is run through check_plain() so there is no need to escape the name.
 */
function example_address_country_admin_form_title($country) {
  return t('Edit !name address options', array('!name' => $country->name));
}

/**
 * An example implementing how you would use the data saved.
 *
 * @param object $country
 */
function example_address_country_configuration_usage($country) {
  $settings = countries_load_configuration_options($country, 'address');
  drupal_set_message(t('Editting the %region for %country', array(
    '%region' => $settings['labels']['region'],
    '%country' => $country->name,
  )));
}
