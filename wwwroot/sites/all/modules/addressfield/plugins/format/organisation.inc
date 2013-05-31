<?php

/**
 * @file
 * Generates a first name + last name format.
 */

$plugin = array(
  'title' => t('Organisation (single line)'),
  'format callback' => 'addressfield_format_organisation_generate',
  'type' => 'organisation',
  'weight' => -10,
);

/**
 * Format callback.
 *
 * @see CALLBACK_addressfield_format_callback()
 */
function addressfield_format_organisation_generate(&$format, $address) {
  $format['organisation_block'] = array(
    '#type' => 'addressfield_container',
    '#attributes' => array('class' => array('addressfield-container-inline', 'name-block')),
    '#weight' => -50,
  );
  $format['organisation_block']['organisation_name'] = array(
    '#title' => t('Company'),
    '#size' => 30,
    '#attributes' => array('class' => array('organisation-name')),
  );
}
