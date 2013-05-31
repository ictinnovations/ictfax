<?php

class simple_access_views_plugin_group extends views_plugin_access {
  function access($account) {
    $roles = array_keys($account->roles);
    $roles[] = $account->uid ? DRUPAL_AUTHENTICATED_RID : DRUPAL_ANONYMOUS_RID;
    
    $groups = simple_access_groups_from_roles($roles);
    return array_intersect(array_filter($this->options['groups']), $groups);
  }
  
  function get_access_callback() {
    return array('simple_access_groups_check_user', array(array_filter($this->options['groups'])));
  }
  
  function summary_title() {
    $count = count($this->options['groups']);
    if ($count < 1) {
      return t('No group(s) selected');
    }
    else if ($count > 1) {
      return t('Multiple groups');
    }
    else {
      $gids = array_map(array('simple_access_views_plugin_group', '_map_groups'), simple_access_get_groups());
      $gid = array_shift($this->options['groups']);
      return $gids[$gid];
    }
  }

  function option_defaults(&$options) {
    $options['groups'] = array();
  }

  function options_form(&$form, &$form_state) {
    $options = array_map(array('simple_access_views_plugin_group', '_map_groups'), simple_access_get_groups());
    $form['groups'] = array(
      '#type' => 'checkboxes',
      '#title' => t('Simple access groups'),
      '#default_value' => $this->options['groups'],
      '#options' => $options,
      '#description' => t('Only the checked simple access groups will be able to access this display. Note that users with "access all views" can see any view, regardless of role.'),
    );
  }
  
  function _map_groups($a) {
    return $a['name'];
  }

  function options_validate(&$form, &$form_state) {
    if (!array_filter($form_state['values']['access_options']['groups'])) {
      form_error($form['role'], t('You must select at least one group if type is "by group"'));
    }
  }

  function options_submit(&$form, &$form_state) {
    // I hate checkboxes.
    $form_state['values']['access_options']['groups'] = array_filter($form_state['values']['access_options']['groups']);
  }
}