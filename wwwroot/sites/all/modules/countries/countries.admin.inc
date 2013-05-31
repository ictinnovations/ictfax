<?php

/**
 * @file
 * Admin page callbacks for the Countries module.
 */

/**
 * Menu callback; Displays a list of all countries.
 */
function countries_admin_overview() {
  $header = array();
  $header[] = array('data' => t('Name'), 'field' => 'c.name', 'sort' => 'asc');
  $header[] = array('data' => t('ISO2'), 'field' => 'c.iso2');
  $columns = variable_get('countries_admin_overview_columns',
    array(
      'iso3' => t('ISO3'),
      'numcode' => t('Number code'),
      'continent' => t('Continent'),
      'official_name' => t('Official name'))
  );
  foreach ($columns as $key => $title) {
    $header[] = array('data' => $title, 'field' => 'c.' . $key);
  }
  $header[] = array('data' => t('Status'), 'field' => 'c.enabled');
  $header[] = array('data' => t('Operations'));
  $query = db_select('countries_country', 'c')->extend('PagerDefault')->extend('TableSort');

  $result = $query
    ->fields('c')
    ->orderByHeader($header)
    ->limit(50)
    ->execute();

  $destination = drupal_get_destination();
  $continents = countries_get_continents();

  include_once DRUPAL_ROOT . '/includes/iso.inc';
  $core_countries = _country_get_predefined_list();

  $rows = array();
  foreach ($result as $country) {
    $row = array();
    $row[] = l($country->name, 'admin/config/regional/countries/' . $country->iso2, array('query' => $destination));
    $row[] = $country->iso2;
    foreach ($columns as $key => $title) {
      switch ($key) {
        case 'continent':
          $row[] = isset($continents[$country->continent]) ? $continents[$country->continent] : t('Unknown');
          break;
        case 'numcode':
          $row[] = theme('countries_number', array('country' => $country));
          break;
        default:
          $row[] = check_plain($country->$key);
          break;
      }
    }
    $row[] = $country->enabled ? t('Enabled') : t('Disabled');
    $operations = l(t('edit'), 'admin/config/regional/countries/' . $country->iso2 , array('query' => $destination));
    if (module_exists('countries_regions')) {

      $count = countries_regions_count($country);

      $operations .= '&nbsp;&nbsp;&nbsp;' . l(t('!count regions', array('!count' => $count)), 'admin/config/regional/countries/' . $country->iso2 . '/regions', array('query' => $destination));
    }
    if (!array_key_exists($country->iso2, $core_countries)) {
      $operations .= '&nbsp;&nbsp;&nbsp;' . l(t('delete'), 'admin/config/regional/countries/' . $country->iso2 . '/delete', array('query' => $destination));
    }
    $row[] = $operations;
    $rows[] = $row;
  }
  if (empty($rows)) {
    $rows[] = array(
      array('data' => t('No countries are available.'), 'colspan' => count($header)),
    );
  }

  $build['countries_table']  = array(
    '#theme' => 'table',
    '#header' => $header,
    '#rows' => $rows,
  );
  $build['countries_pager'] = array('#theme' => 'pager');

  return $build;
}

/**
 * Menu callback; Display a country form.
 */
function countries_admin_page($country = NULL) {
  if (!isset($country->name)) {
    drupal_set_title(t('Add country'), PASS_THROUGH);
    $country = (object)array(
      'cid' => 0,
      'iso2' => '',
      'iso3' => '',
      'name' => '',
      'official_name' => '',
      'continent' => 'UN',
      'enabled' => 1,
      'numcode' => 0);

  }
  return drupal_get_form('countries_admin_form', $country);
}

/**
 * Generate a country form.
 *
 * @ingroup forms
 * @see countries_admin_form_validate()
 * @see countries_admin_form_submit()
 */
function countries_admin_form($form, &$form_state, $country) {

  // Menu callbacks do not have page titles.
  if ($country->cid) {
    drupal_set_title(t('Edit country %title', array('%title' => $country->name)), PASS_THROUGH);
  }

  $form = array();
  $form['cid'] = array(
    '#type' => 'value',
    '#value' => $country->cid,
  );

  $form['name'] = array(
    '#type' => 'textfield',
    '#title' => t('Name'),
    '#default_value' => $country->name,
    '#description' => t('Specify a unique name for this country.'),
    '#required' => TRUE,
    '#maxlength' => 95,
  );
  $iso2_editable = TRUE;
  if (!empty($country->iso2)) {
    include_once DRUPAL_ROOT . '/includes/iso.inc';
    $core_countries = _country_get_predefined_list();
    $iso2_editable = ! array_key_exists($country->iso2, $core_countries);
  }
  if ($iso2_editable) {
    $form['iso2'] = array(
      '#type' => 'textfield',
      '#title' => t('ISO alpha-2 code'),
      '#default_value' => $country->iso2,
      '#description' => t('Specify a unique ISO2 code for this country. This is used as the key to this country, changing it may result in the loss of data.'),
      '#required' => TRUE,
      '#maxlength' => 2,
    );
  }
  else {
    $form['iso2'] = array(
      '#type' => 'value',
      '#value' => $country->iso2,
    );
    $form['iso2']['iso2_info'] = array(
      '#type' => 'textfield',
      '#title' => t('ISO alpha-2 code'),
      '#value' => $country->iso2,
      '#disabled' => TRUE,
      '#description' => t('Core country ISO2 codes are not editable.'),
    );
  }
  $form['iso3'] = array(
    '#type' => 'textfield',
    '#title' => t('ISO alpha-3 code'),
    '#default_value' => $country->iso3,
    '#description' => t('Specify a unique ISO3 code for this country.'),
    '#required' => FALSE,
    '#maxlength' => 3,
  );
  $form['official_name'] = array(
    '#type' => 'textfield',
    '#title' => t('Official name'),
    '#default_value' => $country->official_name,
    '#description' => t('Specify the unique official name for this country.'),
    '#required' => FALSE,
    '#maxlength' => 127,
  );
  $form['numcode'] = array(
    '#type' => 'textfield',
    '#title' => t('ISO numeric-3 code'),
    '#default_value' => empty($country->numcode) ? '' : $country->numcode,
    '#description' => t('Specify a unique number code for this country.'),
    '#required' => FALSE,
    '#maxlength' => 5,
  );

  $form['continent'] = array('#type' => 'select',
    '#title' => t('Continent'),
    '#options' => countries_get_continents(),
    '#default_value' => $country->continent,
    '#required' => TRUE,
  );
  $form['enabled'] = array('#type' => 'checkbox',
    '#title' => t('Enabled'),
    '#default_value' => $country->enabled,
  );

  if (!empty($country->iso2)) {
    $form['#country'] = $country;
  }

  $country = (object) $country;
  field_attach_form('country', $country, $form, $form_state);

  $form['submit'] = array('#type' => 'submit', '#value' => t('Save'), '#weight' => 100);

  return $form;
}

/**
 * Validate country form submissions.
 */
function countries_admin_form_validate($form, &$form_state) {
  // Edits
  $unique_keys = array('name', 'iso2', 'iso3', 'official_name', 'numcode');

  foreach ($unique_keys as $key) {
    if (drupal_strlen($form_state['values'][$key])) {
      $iso2 = isset($form['#country']) ? $form['#country']->iso2 : FALSE;
      if ($key == 'iso2' || $key == 'iso3') {
        $form_state['values'][$key] = drupal_strtoupper($form_state['values'][$key]);
      }
      else {
        $form_state['values'][$key] = trim($form_state['values'][$key]);
      }
      switch ($key) {
        case 'name':
          break;
        case 'iso2':
        case 'iso3':
          if (preg_match('/[^A-Z]/', $form_state['values'][$key])) {
            form_set_error($key, t('Please only use uppercase characters for ISO codes.'));
            continue;
          }
          else {
            $length = $key == 'iso2' ? 2 : 3;
            if (drupal_strlen($form_state['values'][$key]) != $length) {
              form_set_error($key, t('The ISO!length code must be exactly !length characters.', array('!length' => $length)));
              continue;
            }
          }
          break;
        case 'official_name':
          break;
        case 'numcode':
          if (preg_match('/[^0-9]/', $form_state['values'][$key])) {
            form_set_error($key, t('Only numbers are allowed for the number code.'));
            continue;
          }
          break;
      }
      if ($key == 'numcode' && empty($form_state['values'][$key])) {
        // Duplicate 0 values are OK.
      }
      elseif ((bool) db_query_range("SELECT 1 FROM {countries_country} WHERE iso2 <> :orginaliso2 AND LOWER({$key}) = LOWER(:$key)", 0, 1, array(':orginaliso2' => $iso2, ":$key" => $form_state['values'][$key]))->fetchField()) {
        form_set_error($key, t('The value %value is already taken.', array('%value' => $form_state['values'][$key])));
      }
    }
  }
}

/**
 * Process country form submissions.
 */
function countries_admin_form_submit($form, &$form_state) {
  $country = (object) $form_state['values'];
  entity_form_submit_build_entity('country', $country, $form, $form_state);

  // Required to trigger an update.
  $iso2 = isset($form['#country']) ? $form['#country']->iso2 : FALSE;

  country_save($country, $iso2);

  if ($iso2) {
    $message = t('The country %country has been updated.', array('%country' => $country->name));
  }
  else {
    $message = t('Added country %country.', array('%country' => $country->name));
  }
  drupal_set_message($message);
  $form_state['redirect'] = 'admin/config/regional/countries';
}

/**
 * Menu callback; confirm deletion of a country.
 *
 * @ingroup forms
 * @see countries_admin_delete_submit()
 */
function countries_admin_delete($form, &$form_state, $country) {
  include_once DRUPAL_ROOT . '/includes/iso.inc';
  $core_countries = _country_get_predefined_list();
  if (array_key_exists($country->iso2, $core_countries)) {
    drupal_set_message(t('Core countries defined by the system can not be deleted.'), 'error');
    drupal_goto('admin/config/regional/countries');
  }

  $form['#country'] = $country;

  return confirm_form($form,
    t('Are you sure you want to delete the country %country?', array('%country' => $country->name)),
    'admin/config/regional/countries',
    t('References that use this country will become invalid. This action cannot be undone.'),
    t('Delete'),
    t('Cancel')
  );
}

/**
 * Process countries delete form submission.
 */
function countries_admin_delete_submit($form, &$form_state) {
  $country = $form['#country'];
  field_attach_delete('country', $country);
  db_delete('countries_country')
    ->condition('iso2', $country->iso2)
    ->execute();

  // Hook to allow other modules to interact with this module.
  module_invoke_all('country_delete', $country);

  drupal_set_message(t('Deleted country %country.', array('%country' => $country->name)));
  $form_state['redirect'] = 'admin/config/content/countries';
}

/**
 * Menu callback to update the database from the CSV file.
 */
function countries_admin_import_form($form, &$form_state) {
  $changes = countries_csv_updates();
  if (count($changes['inserts'])) {
    $form_state['inserts'] = $changes['inserts'];
    $form['inserts'] = array(
      '#type' => 'checkboxes',
      '#title' => t('Select the countries to import'),
    );
    foreach ($changes['inserts'] as $iso2 => $country) {
      $t_options = array(
        '%name' => $country->name,
        '%continent' => $country->continent,
        '%official_name' => $country->official_name,
        '%iso2' => $country->iso2,
        '%iso3' => $country->iso3,
        '%numcode' => theme('countries_number', array('country' => $country)),
        '%enabled' => $country->enabled ? t('Enabled') : t('Disabled'),
      );
      $form['inserts']['#options'][$iso2] = t('New country %name, %continent (%official_name): %iso2, %iso3, %numcode, %enabled', $t_options);
      $form['inserts']['#default_options'][$iso2] = $iso2;
    }
  }
  else {
    $form['inserts'] = array(
      '#type' => 'markup',
      '#markup' => '<div class="form-item">' . t('There are no new records to import.') . '</div>',
    );
  }
  if (count($changes['updates'])) {
    $form_state['updates'] = $changes['updates'];
    $form['updates'] = array(
      '#type' => 'checkboxes',
      '#title' => t('Select the countries and their properties to update'),
    );
    //  $updates[$country->iso2][$key] = array('new' => $country->{$key}, 'old' => $existing->{$key});

    foreach ($changes['updates'] as $iso2 => $changes) {
      $country = country_load($iso2);
      foreach ($changes as $key => $values) {
        $t_options = array(
          '%name' => $country->name,
          '%iso2' => $country->iso2,
          '%code' => $key,
          '%new' => $values['new'],
          '%old' => $values['old'],
        );
        if ($key == 'enabled') {
          if ($values['new']) {
            $form['updates']['#options'][$iso2 . '-' . $key] = t('%name (%iso2): Enable this country', $t_options);
          }
          else {
            $form['updates']['#options'][$iso2 . '-' . $key] = t('%name (%iso2): Disable this country', $t_options);
          }

        }
        else {
          $form['updates']['#options'][$iso2 . '-' . $key] = t('%name (%iso2): Change %code from "%old" to "%new"', $t_options);
        }
        $form['updates']['#default_options'][$iso2 . '-' . $key] = $iso2 . '-' . $key;
      }
    }
  }
  else {
    $form['updates'] = array(
      '#type' => 'markup',
      '#markup' => '<div class="form-item">' . t('There are no updates to import.') . '</div>',
    );
  }
  if (!empty($form_state['inserts']) || !empty($form_state['updates'])) {
    $form['submit'] = array(
      '#type' => 'submit',
      '#value' => t('Import'),
    );
  }
  return $form;
}

function countries_admin_import_form_submit($form, &$form_state) {
  $inserted = array();
  if (!empty($form_state['inserts'])) {
    foreach (array_filter($form_state['values']['inserts']) as $iso2) {
      $country = $form_state['inserts'][$iso2];
      country_save($form_state['inserts'][$iso2]);
      $inserted[] = l($country->name, 'admin/config/regional/countries/' . $country->iso2);
    }
  }
  if (count($inserted)) {
    drupal_set_message(t('The newly imported countries were: !countries', array('!countries' => implode('; ', $inserted))));
  }

  $updated = array();
  if (!empty($form_state['updates'])) {
    $changes = array();
    foreach (array_filter($form_state['values']['updates']) as $change) {
      list ($iso2, $key) = explode ('-', $change);
      $changes[$iso2][$key] = $form_state['updates'][$iso2][$key]['new'];
    }
    foreach ($changes as $iso2 => $values) {
      $country = country_load($iso2);
      foreach ($values as $key => $value) {
        $country->{$key} = $value;
      }
      country_save($country, $iso2);
      $updated[] = l($country->name, 'admin/config/regional/countries/' . $country->iso2);
    }
  }
  if (count($updated)) {
    drupal_set_message(t('The updated countries were: !countries', array('!countries' => implode('; ', $updated))));
  }

  if (empty($inserted) && empty($updated)) {
    drupal_set_message(t('No changes to the countries database were done.'));
  }
  $form_state['redirect'] = 'admin/config/regional/countries';
}

function countries_csv_updates($file = NULL) {
  if (!$file) {
    $file = drupal_get_path('module', 'countries') . '/countries.csv';
  }

  $countries = array();
  $handle = fopen($file, "r");
  $headers = fgetcsv($handle, 1024, ",");
  while (($row = fgetcsv($handle, 1024, ",")) !== FALSE) {
    $row[0] = trim($row[0]);  // iso2
    $row[1] = empty($row[1]) || $row[1] == 'NULL' ? '' : trim($row[1]); // iso3
    $row[2] = empty($row[2]) || $row[2] == 'NULL' ? '' : trim($row[2]); // name
    $row[3] = empty($row[3]) || $row[3] == 'NULL' ? '' : trim($row[3]); // official name
    $row[4] = empty($row[4]) || $row[4] == 'NULL' ? 0 : trim($row[4]); // number code
    $row[5] = empty($row[5]) || $row[5] == 'NULL' ? 'UN' : trim($row[5]); // continent
    $row[6] = empty($row[6]) || $row[6] == 'NULL' ? '0' : '1'; // enabled
    if (!empty($row[0]) && $row[0] != 'NULL') {
      $countries[$row[0]] = array(
        'iso2' => $row[0],
        'iso3' => $row[1],
        'name' => $row[2],
        'official_name' => $row[3],
        'numcode' => $row[4],
        'continent' => $row[5],
        'enabled' => $row[6],
      );
    }
  }
  fclose($handle);

  $inserts = array();
  $updates = array();

  foreach ($countries as $country) {
    $country = (object) $country;
    if ($existing = country_load($country->iso2)) {
      foreach (array('iso3', 'name', 'official_name', 'numcode', 'continent', 'enabled') as $key) {
        if (empty($country->{$key}) && $country->{$key} !== '0') {
          continue;
        }
        if ($existing->{$key} !== $country->{$key}) {
          $updates[$country->iso2][$key] = array('new' => $country->{$key}, 'old' => $existing->{$key});
        }
      }
    }
    else {
      $inserts[$country->iso2] = $country;
    }
  }
  return array(
    'inserts' => $inserts,
    'updates' => $updates,
  );
}
