<?php

/**
 * @file
 * views_handler_field_countries_continent.inc
 */

class views_handler_field_countries_continent extends views_handler_field {
  function option_definition() {
    $options = parent::option_definition();
    $options['continent_code'] = array('default' => FALSE);

    return $options;
  }

  /**
   * Provide continent_code option.
   */
  function options_form(&$form, &$form_state) {
    parent::options_form($form, $form_state);
    $form['continent_code'] = array(
      '#title' => t('Output machine name'),
      '#description' => t('Display field as the continent machine name.'),
      '#type' => 'checkbox',
      '#default_value' => !empty($this->options['continent_code']),
    );
  }

  /**
   * Render contient as human readable name or continent code
   */
  function render($values) {
    $data = parent::render($values);
    if ($this->options['continent_code'] != 1 && $data !== NULL && $data !== '') {
      $continents = countries_get_continents();
      return $continents[$data];
    }
    return $data;
  }
}