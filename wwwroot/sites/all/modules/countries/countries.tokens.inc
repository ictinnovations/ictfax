<?php

/**
 * @file
 * Builds placeholder replacement tokens for country-related data.
 */

/**
 * Implements hook_token_info().
 */
function countries_token_info() {
  $types['country'] = array(
    'name' => t('Countries'),
    'description' => t('Tokens related to individual countries.'),
    'needs-data' => 'country',
  );
  $types['default-country'] = array(
    'name' => t('Default country'),
    'description' => t('Tokens related to the sites default country.'),
    'type' => 'country',
  );

  $country['cid'] = array(
    'name' => t('Country ID'),
    'description' => t("The unique ID of the country."),
  );
  $country['name'] = array(
    'name' => t("Name"),
    'description' => t("The name of the country."),
  );
  $country['official-name'] = array(
    'name' => t("Country official name"),
    'description' => t("The official name of the country."),
  );
  $country['iso2'] = array(
    'name' => t("Country iso2 code"),
    'description' => t("The iso2 code of the country."),
  );
  $country['iso3'] = array(
    'name' => t("Country iso3 code"),
    'description' => t("The iso3 code of the country."),
  );
  $country['numcode'] = array(
    'name' => t("Country numeric iso code"),
    'description' => t("The numeric iso code of the country."),
  );
  $country['continent'] = array(
    'name' => t("Country continent"),
    'description' => t("The continent name of the country."),
  );
  $country['continent-code'] = array(
    'name' => t("Country continent code"),
    'description' => t("The continent code of the country."),
  );
  $country['enabled'] = array(
    'name' => t("Country status"),
    'description' => t("The status of the country."),
  );


  return array(
    'types' => $types,
    'tokens' => array('country' => $country),
  );
}

/**
 * Implements hook_tokens().
 */
function countries_tokens($type, $tokens, array $data = array(), array $options = array()) {
  $sanitize = !empty($options['sanitize']);
  $replacements = array();
  if ($type == 'country' && !empty($data['country'])) {
    $country = $data['country'];
    foreach ($tokens as $name => $original) {
      switch ($name) {
        // Basic country information.
        case 'cid':
          $replacements[$original] = $country->cid;
          break;

        case 'name':
        case 'official-name':
        case 'iso2':
        case 'iso3':
          $property = str_replace('-', '_', $name);
          $replacements[$original] = $sanitize ? check_plain($country->{$property}) : $country->{$property};
          break;

        case 'continent':
          $continents = countries_get_continents();
          $continent = isset($continents[$country->continent]) ? $continents[$country->continent] : '';
          $replacements[$original] = $sanitize ? check_plain($continent) : $continent;
          break;

        case 'continent-code':
          $replacements[$original] = $sanitize ? check_plain($country->continent) : $country->continent;
          break;

        case 'numcode':
          $replacements[$original] = theme('countries_number', array('country' => $country));
          break;

        case 'enabled':
          $replacements[$original] = $country->enabled ? t('Enabled') : t('Disabled');
          break;

      }
    }
  }

  if ($type == 'default-country') {
    $country = country_load(variable_get('site_default_country', ''));
    $replacements += token_generate('country', $tokens, array('country' => $country), $options);
  }

  return $replacements;
}
