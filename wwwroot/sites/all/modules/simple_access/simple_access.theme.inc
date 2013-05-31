<?php
/**
 * @file
 * Provide themes for simple access administration
 */

function theme_simple_access_form($form) {
  drupal_add_css(drupal_get_path('module', 'simple_access') . '/simple_access.css');

  $options = array();
  $output = '';
  if (isset($form['#admin'])) {
    $variable = array('view' => 1, 'update' => 1, 'delete' => 1);
  }
  else {
    $variable = variable_get('sa_display', array('view' => 1));
  }
  $options['header'] = array(t('Access Group'));
  if ((isset($variable['view']) && $variable['view']) || isset($form['#admin'])) {
    $options['header'][] = t('View');
  }
  if ((isset($variable['update']) && $variable['update']) || isset($form['#admin'])) {
    $options['header'][] = t('Update');
  }
  if ((isset($variable['delete']) && $variable['delete']) || isset($form['#admin'])) {
    $options['header'][] = t('Delete');
  }

  foreach (element_children($form['form']) as $gid) {
    if (!isset($form['#access']) || $form['#access']) {
      $row = array(
        array('data' => drupal_render($form['form'][$gid]['name'])),
      );
      if ((isset($variable['view']) && $variable['view']) || isset($form['#admin'])) {
        $row[] = array(
          'data' => drupal_render($form['form'][$gid]['sa_view']),
        );
      }
      if ((isset($variable['update']) && $variable['update']) || isset($form['#admin'])) {
        $row[] = array(
          'data' => drupal_render($form['form'][$gid]['sa_update']),
        );
      }
      if ((isset($variable['delete']) && $variable['delete']) || isset($form['#admin'])) {
        $row[] = array(
          'data' => drupal_render($form['form'][$gid]['sa_delete']),
        );
      }

      $options['rows'][] = $row;
    }
  }

  if (!empty($options['rows'])) {
    $output .= theme('table', $options);
    return $output;
  }
}

function theme_simple_access_page_overview_list(&$form) {
  drupal_add_tabledrag('sa-group-list', 'order', 'sibling', 'sa-group-weight');
  $output = '';
  $options = array(
    'header' => array(t('Group'), t('Roles'), t('Weight'), t('Operations')),
    'rows' => array(),
    'attributes' => array('id' => 'sa-group-list'),
  );
  foreach (element_children($form['form'], TRUE) as $gid) {
    $options['rows'][] = array(
      'data' => array(
        drupal_render($form['form'][$gid]['name']),
        array('data' => drupal_render($form['form'][$gid]['roles']), 'class' => 'sa-group-roles'),
        drupal_render($form['form'][$gid]['weight']),
        drupal_render($form['form'][$gid]['ops']),
      ),
      'class' => array('draggable'),
    );
  }
  
  $output .= theme('table', $options);
  
  return $output;
}

function theme_simple_access_profile_list($form) {
  drupal_add_tabledrag('sa-profile-list', 'order', 'sibling', 'sa-profile-weight');
  $options = array(
    'header' => array(t('Name'), t('Weight'), t('Operations')),
    'rows' => array(),
    'attributes' => array('id' => 'sa-profile-list'),
  );
  $output = '';

  foreach (element_children($form['form']['profiles']) as $id) {
    $options['rows'][] = array(
      'data' => array(
        array('data' => drupal_render($form['form']['profiles'][$id]['name'])),
        array('data' => drupal_render($form['form']['profiles'][$id]['weight'])),
        array('data' => drupal_render($form['form']['profiles'][$id]['operations'])),
      ),
      'class' => array('draggable'),
    );
  }

  if (empty($data['rows'])) {
    $data['rows'][] = array(
      array(
        'data' => t('No profiles defined'),
        'colspan' => 3,
        'align' => 'center',
      ),
    );
  }
  $output .= theme('table', $options);

  return $output;
}


