<?php

/**
 * @file
 * views_handler_filter_countries_list.inc
 */

/**
 * Filter by ISO Code 2. The Lable is defined via 'property' in hook_views_data.
 */
class views_handler_filter_countries_list extends views_handler_filter_in_operator {
  function option_definition() {
    $options = parent::option_definition();
    $options['configuration'] = array('default' => COUNTRIES_VIEWS_WIDGET_FIELD);
    $options['filter']['enabled'] = array('default' => COUNTRIES_ENABLED);
    $options['filter']['continents'] = array('default' => array());
    return $options;
  }

  function has_extra_options() { return TRUE; }

  function extra_options_form(&$form, &$form_state) {
    $form['configuration'] = array(
      '#type' => 'radios',
      '#title' => t('Widget configuration'),
      '#required' => TRUE,
      '#options' => array(
        COUNTRIES_VIEWS_WIDGET_FIELD => t('Field based configuration'),
        COUNTRIES_VIEWS_WIDGET_CUSTOM => t('Custom'),
      ),
      '#default_value' => $this->options['configuration'],
    );

    $form['filter'] = array(
      '#type' => 'fieldset',
      '#title' => t('Custom settings'),
      '#states' => array(
        // Only show field when widget equals "custom"
        'visible' => array(
          ':input[name="options[configuration]"]' => array('value' => COUNTRIES_VIEWS_WIDGET_FIELD),
        ),
      ),
    );

    $form['filter']['enabled'] = array(
      '#type' => 'radios',
      '#title' => t('Country status'),
      '#required' => TRUE,
      '#states' => array(
        // Only show field when widget equals "custom"
        'visible' => array(
          ':input[name="options[configuration]"]' => array('value' => COUNTRIES_VIEWS_WIDGET_FIELD),
        ),
      ),
      '#options' => array(
        COUNTRIES_ENABLED => t('Enabled countries only'),
        COUNTRIES_DISABLED => t('Disabled countries only'),
        COUNTRIES_ALL => t('Both'),
      ),
      '#default_value' => $this->options['filter']['enabled'],
    );

    $form['filter']['continents'] = array(
      '#type' => 'checkboxes',
      '#title' => t('Filter by continent'),
      '#description' => t('If no continents are selected, this filter will not be used.'),
      '#states' => array(
        // Only show field when widget equals "custom"
        'visible' => array(
          ':input[name="options[configuration]"]' => array('value' => COUNTRIES_VIEWS_WIDGET_FIELD),
        ),
      ),
      '#options' => countries_get_continents(),
      '#element_validate' => array('_countries_checkbox_filter'),
      '#default_value' => $this->options['filter']['continents'],
    );
  }

  function get_value_options() {
    $options = array();
    switch ($this->options['configuration']) {
      case COUNTRIES_VIEWS_WIDGET_FIELD:
        if (isset($this->options['relationship'])) {
          if ($field = field_info_field(substr($this->options['relationship'], 0, -5))) {
            $options = $field['settings'];
          }
        }
        break;
      case COUNTRIES_VIEWS_WIDGET_CUSTOM:
        $options = $this->options['filter'];
        break;
    }

    $property = (isset($this->definition['property'])) ? $this->definition['property'] : 'name';
    $this->value_options = countries_filter(countries_get_countries($property), $options);
    asort($this->value_options);
  }
}
