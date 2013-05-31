<?php

/**
 * @file
 * countries.views.inc
 */

/**
 * Implements hook_views_data().
 */
function countries_views_data() {
  $data = array();

  $data['countries_country']['table']['group'] = t('Countries');

  $data['countries_country']['table']['base'] = array(
    'field' => 'cid',
    'title' => t('Countries'),
    'help' => ''
  );

  $data['countries_country']['cid'] = array(
    'title' => t('Country ID'),
    'help' => t('The country ID of the country.'),
    'field' => array(
       'handler' => 'views_handler_field_numeric',
       'click sortable' => TRUE,
     ),
     'filter' => array(
       'handler' => 'views_handler_filter_numeric',
     ),
     'sort' => array(
       'handler' => 'views_handler_sort',
     ),
  );

  $data['countries_country']['iso2'] = array(
    'title' => t('ISO2'),
    'help' => t('The ISO2 country code of the country.'),
    'field' => array(
      'handler' => 'views_handler_field',
      'click sortable' => TRUE,
    ),
    'sort' => array(
      'handler' => 'views_handler_sort',
    ),
    'filter' => array(
      'handler' => 'views_handler_filter_string',
    ),
    'argument' => array(
      'handler' => 'views_handler_argument_string',
    ),
  );

  $data['countries_country']['iso2_list'] = array(
    'title' => t('ISO2 - list'),
    'help' => t('The ISO2 country code of the country.'),
    'real field' => 'iso2',
    'filter' => array(
      'handler' => 'views_handler_filter_countries_list',
      'property' => 'iso2',
    ),
  );

  $data['countries_country']['iso3'] = array(
    'title' => t('ISO3'),
    'help' => t('The ISO3 country code of the country.'),
    'field' => array(
      'handler' => 'views_handler_field',
      'click sortable' => TRUE,
    ),
    'sort' => array(
      'handler' => 'views_handler_sort',
    ),
    'filter' => array(
      'handler' => 'views_handler_filter_string',
      'property' => 'iso3',
    ),
    'argument' => array(
      'handler' => 'views_handler_argument_string',
    ),
  );

  $data['countries_country']['iso3_list'] = array(
    'title' => t('ISO3 - list'),
    'help' => t('The ISO3 country code of the country.'),
    'real field' => 'iso2',
    'filter' => array(
      'handler' => 'views_handler_filter_countries_list',
      'property' => 'iso3',
    ),
  );

  $data['countries_country']['name'] = array(
    'title' => t('Name'),
    'help' => t('The name of the country.'),
    'field' => array(
      'handler' => 'views_handler_field',
      'click sortable' => TRUE,
    ),
    'sort' => array(
      'handler' => 'views_handler_sort',
    ),
    'filter' => array(
      'handler' => 'views_handler_filter_string',
    ),
    'argument' => array(
      'handler' => 'views_handler_argument_string',
    ),
  );

  $data['countries_country']['name_list'] = array(
    'title' => t('Name - list'),
    'help' => t('The name of the country.'),
    'real field' => 'iso2',
    'filter' => array(
      'handler' => 'views_handler_filter_countries_list',
      'property' => 'name',
    ),
  );

  $data['countries_country']['official_name'] = array(
    'title' => t('Official name'),
    'help' => t('The official name of the country.'),
    'field' => array(
      'handler' => 'views_handler_field',
      'click sortable' => TRUE,
    ),
    'sort' => array(
      'handler' => 'views_handler_sort',
    ),
    'filter' => array(
      'handler' => 'views_handler_filter_string',
    ),
    'argument' => array(
      'handler' => 'views_handler_argument_string',
    ),
  );

  $data['countries_country']['official_name_list'] = array(
    'title' => t('Offical name - list'),
    'help' => t('The official name of the country.'),
    'real field' => 'iso2',
    'filter' => array(
      'handler' => 'views_handler_filter_countries_list',
      'property' => 'official_name',
    ),
  );

  $data['countries_country']['continent'] = array(
    'title' => t('Continent'),
    'help' => t('The contient of this country.'),
    'field' => array(
      'handler' => 'views_handler_field_countries_continent',
      'click sortable' => TRUE,
    ),
    'sort' => array(
      'handler' => 'views_handler_sort',
    ),
    'filter' => array(
      'handler' => 'views_handler_filter_string',
    ),
    'argument' => array(
      'handler' => 'views_handler_argument_string',
    ),
  );

  $data['countries_country']['continent_list'] = array(
    'title' => t('Continent - list'),
    'help' => t('The contient of this country.'),
    'real field' => 'continent',
    'filter' => array(
      'handler' => 'views_handler_filter_countries_continents_list',
      'property' => 'continent',
    ),
  );

  $data['countries_country']['enabled'] = array(
    'title' => t('Enabled'),
    'help' => t('Whether or not the country is enabled.'),
    'field' => array(
      'handler' => 'views_handler_field_boolean',
      'click sortable' => TRUE,
    ),
    'filter' => array(
      'handler' => 'views_handler_filter_boolean_operator',
      'label' => t('Enabled'),
      'type' => 'yes-no',
      // use boolean_field = 1 instead of boolean_field <> 0 in WHERE statment
      'use equal' => TRUE,
    ),
    'sort' => array(
      'handler' => 'views_handler_sort',
    ),
  );

  return $data;
}

/**
 * Implements hook_field_views_data().
 *
 * @see field_views_field_default_views_data()
 */
function countries_field_views_data($field) {
  $data = field_views_field_default_views_data($field);
  foreach ($data as $table_name => $table_data) {
    foreach ($table_data as $field_name => $field_data) {
      if (!in_array($field_name, array('table', 'entity_id', 'revision_id'))) {
        $data[$table_name][$field_name]['relationship'] = array(
          'handler' => 'views_handler_relationship',
          'base' => 'countries_country',
          'base field' => 'iso2',
          'label' => t('country from !field_name', array('!field_name' => $field['field_name'])),
          'countries' => array(
            'field' => $field['field_name'],
          ),
        );
      }
    }
  }

  return $data;
}
