<?php

/**
 * @file
 * House all the admin functions in inc to make the foot print a lot
 * smaller.
 */

function simple_access_page_overview() {
  if (count($groups = simple_access_get_groups())) {
    drupal_set_title(t('Access groups'));
    $roles = user_roles();
    $form['groups'] = array(
      '#tree' => TRUE,
      '#theme' => 'simple_access_page_overview_list',
    );
    foreach ($groups as $group) {
      $gid = $group['gid'];
      $form['groups'][$gid]['name'] = array(
        '#markup' => $group['name'],
      );
      $r = array();
      foreach ($group['roles'] as $rid) {
        $r[] = $roles[$rid];
      }
      $form['groups'][$gid]['roles'] = array(
        '#markup' => implode(', ', $r),
      );
      $form['groups'][$gid]['weight'] = array(
        '#type' => 'weight',
        '#default_value' => $group['weight'],
        '#attributes' => array('class' => array('sa-group-weight')),
      );
      $form['groups'][$gid]['ops'] = array(
        '#markup' => l(t('edit'), 'admin/config/simple-access/groups/' . $gid . '/edit/') . '&nbsp;' . l(t('delete'), 'admin/config/simple-access/groups/' . $gid . '/delete'),
      );
    }
    $form['submit'] = array(
      '#type' => 'submit',
      '#value' => t('Update'),
    );
    return $form;
  }
  else {
    drupal_set_message(t('You have not yet defined any access groups.'));
    drupal_goto('admin/config/simple-access/groups/add');
  }
}

function simple_access_page_overview_submit($form, &$form_state) {
  foreach ($form_state['values']['groups'] as $gid => $group) {
    db_update('simple_access_groups')
      ->condition('gid', $gid)
      ->fields(array(
        'weight' => $group['weight'],
      ))
      ->execute();
  }
}

function simple_access_group_form($form, &$form_state, $group = array()) {
  $roles = array();
  if (!empty($group)) {
    drupal_set_title(t('Edit Access Group'));
    $form['gid'] = array(
      '#type' => 'value',
      '#value' => $group['gid'],
    );
  }
  else {
    drupal_set_title(t('Create Access Group'));
  }
  $group += array('name' => '', 'roles' => array(), 'weight' => 0);
  
  $form['name'] = array(
    '#type' => 'textfield',
    '#title' => t('Name'),
    '#default_value' => $group['name'],
    '#size' => 40,
    '#maxlength' => 80,
    '#description' => t('The name for the access group as it will appear on the content editing form.'),
    '#required' => TRUE,
  );
  $form['roles'] = array(
    '#type' => 'checkboxes',
    '#title' => t('Roles'),
    '#default_value' => $group['roles'],
    '#options' => user_roles(),
    '#description' => t('Roles that can view'),
  );
  $form['weight'] = array(
    '#type' => 'weight',
    '#title' => 'Weight',
    '#default_value' => $group['weight'],
    '#delta' => 10,
    '#description' => t('When setting permissions, heavier names will sink and lighter names will be positioned nearer the top.'),
  );
  $form[] = array(
    '#type' => 'submit',
    '#value' => t('Submit'),
  );
  return $form;
}

function simple_access_group_form_submit($form, &$form_state) {
  simple_access_save_group($form_state['values']);
  $form_state['redirect'] = 'admin/config/simple-access/groups';
}

function simple_access_delete_group_confirm($form, $form_state, $group) {
  $form['gid'] = array(
    '#type' => 'value',
    '#value' => $group['gid'],
  );
  return confirm_form($form,
    t('Are you sure you want to delete this group?'),
    'admin/config/simple-access/groups',
    t('This action cannot be undone.'), t('Delete'), t('Cancel')
  );
}

function simple_access_delete_group_confirm_submit($form, &$form_state) {
  simple_access_delete_group($form_state['values']['gid']);
  $form_state['redirect'] = 'admin/config/simple-access/groups';
}

function simple_access_profile_list() {
  $form = array();
  $result = db_select('simple_access_profiles', 'p')
    ->fields('p', array('pid', 'name', 'weight'))
    ->orderBy('weight', 'ASC')
    ->orderBy('name', 'ASC')
    ->execute();

  $profiles = $result->fetchAllAssoc('pid', PDO::FETCH_ASSOC);
  if (empty($profiles)) {
    drupal_set_message(t('You have not yet defined any access profiles.'));
    drupal_goto('admin/config/simple-access/profiles/add');
  }
  
  $form['profiles'] = array(
    '#tree' => TRUE,
  );
  foreach ($profiles as $row) {
    $form['profiles'][$row['pid']]['name'] = array(
      '#markup' => $row['name'],
    );
    $form['profiles'][$row['pid']]['weight'] = array(
      '#type' => 'weight',
      '#default_value' => $row['weight'],
      '#attributes' => array('class' => array('sa-profile-weight')),
    );
    $form['profiles'][$row['pid']]['operations'] = array(
      '#markup' => l(t('edit'), 'admin/config/simple-access/profiles/' . $row['pid'] . '/edit') . ' ' . l(t('delete'), 'admin/config/simple-access/profiles/' . $row['pid'] . '/delete'),
    );
  }

  $form['submit'] = array(
    '#type' => 'submit',
    '#value' => t('Update'),
  );

  return $form;
}

function simple_access_profile_list_submit($form, $form_state) {
  foreach ($form_state['values']['profiles'] as $pid => $profile) {
    $profile['pid'] = $pid;
    drupal_write_record('simple_access_profiles', $profile, array('pid'));
  }
}

function simple_access_profile_form($form, $form_state, $profile = array()) {
  $profile += array('access' => FALSE);

  if (!empty($profile['pid'])) {
    $form['pid'] = array(
      '#type' => 'value',
      '#value' => $profile['pid'],
    );
  }

  $form['name'] = array(
    '#type' => 'textfield',
    '#title' => t('Name'),
    '#default_value' => isset($profile['name']) ? $profile['name'] : '',
    '#required' => TRUE,
  );

  $form['access'] = array(
    '#tree' => TRUE,
    '#theme' => 'simple_access_form',
  );

  $groups = simple_access_group_select();
  foreach ($groups as $gid => $group) {
    $form['access'][$gid] = simple_access_form_row($gid, $group, $profile['access']);
  }

  $form['submit'] = array(
    '#type' => 'submit',
    '#value' => empty($pid) ? t('Submit') : t('Update'),
  );

  return $form;
}

function simple_access_profile_form_submit($form, &$form_state) {
  if (!empty($form_state['values']['pid'])) {
    drupal_write_record('simple_access_profiles', $form_state['values'], array('pid'));
  }
  else {
    drupal_write_record('simple_access_profiles', $form_state['values']);
  }

  db_delete('simple_access_profiles_access')
    ->condition('pid', $form_state['values']['pid'])
    ->execute();
  if (isset($form_state['values']['access'])) {
    foreach ($form_state['values']['access'] as $gid => $access) {
      if ($access['sa_view'] || $access['sa_update'] || $access['sa_delete']) {
        $access['pid'] = $form_state['values']['pid'];
        $access['gid'] = $gid;
        drupal_write_record('simple_access_profiles_access', $access);
      }
    }
  }

  $form_state['redirect'] = 'admin/config/simple-access/profiles';
}

function simple_access_settings_page() {
  drupal_set_title(t('Simple Access Settings'));
  $options = array(
    'view' => t('<strong>View</strong>: Displays viewability selections at top of node form. Selected access groups will be the only users who can view the node. All unselected = normal node behavior (viewable by all).<br />'),
    'update' => t('<strong>Edit</strong>: Displays editability selections at top of node form. Users who are part of selected access groups will be able to edit this node. All unselected = "normal" node behavior (only author and admins may edit).<br />'),
    'delete' => t('<strong>Delete</strong>: Displays deleteability selections at top of node form. Users who are part of selected access groups will be able to delete this node. All unselected = "normal" node behavior (only author and admins may delete).<br />')
  );
  $form['sa_display'] = array(
    '#type' => 'checkboxes',
    '#title' => t('Display'),
    '#default_value' => variable_get('sa_display', array('view')),
    '#options' => $options,
    '#description' => t('Which options should appear on node add/edit pages for administrators? Select at least one.'),
    '#required' => TRUE
  );
  $form['sa_showgroups'] = array(
    '#type' => 'checkbox',
    '#title' => 'Show groups even when user is not a member.',
    '#default_value' => variable_get('sa_showgroups', 0),
    '#description' => 'This is useful when you want to have a user be able to make content viewable by themselves and a higher privileged group (e.g. students sharing work with faculty)',
    );
  return system_settings_form($form);
}

function simple_access_profile_delete_confirm($form, &$form_state, $profile) {
  $form['pid'] = array(
    '#type' => 'value',
    '#value' => $profile['pid'],
  );
  return confirm_form($form,
    t('Are you sure you want to delete this profile?'),
    'admin/config/simple-access/profiles',
    t('This action cannot be undone.'), t('Delete'), t('Cancel')
  );
}

function simple_access_profile_delete_confirm_submit($form, &$form_state) {
  simple_access_delete_profile($form_state['values']['pid']);
  $form_state['redirect'] = 'admin/config/simple-access/profiles';
}

