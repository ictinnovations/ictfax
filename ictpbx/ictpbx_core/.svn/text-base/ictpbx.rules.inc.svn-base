<?php

/**
 * @file
 * Rules hooks for ictpbx.module.
 */


/**
 * Implements hook_rules_event_info().
 
function ictpbx_rules_event_info() {
  $order = array(
    'type' => 'uc_order',
    'label' => t('Order'),
  );
  $account = array(
    'type' => 'user',
    'label' => t('User'),
  );
  $expiration = array(
    'type' => 'ictpbx_expiration',
    'label' => t('Role expiration'),
  );

  $events['ictpbx_order_status_update'] = array(
    'label' => t('Update ICTPBX User table'),
    'group' => t('Notification'),
    'variables' => array(
      'order' => $order,
      'expiration' => $expiration,
    ),
  );

  return $events;
}

/**
 * Implements hook_rules_condition_info().
 *
 * Declares any meta-data about conditions for Rules in an associative, nested
 * array. Works very similar to the action declarations, but conditions cannot
 * provide any new parameters and only return TRUE or FALSE. See also
 * hook_rules_condition_info in the rules.api.php file, and the online
 * documentation at http://drupal.org/node/878928.
 */
function ictpbx_rules_condition_info() {
  $conditions = array();

  $conditions['ictpbx_package_type'] = array(
    'label' => t('Package type'),
    'group' => t('ICTPBX'),
    'parameter' => array(
      'order' => array('type' => 'uc_order', 'label' => t('Order')),
    ),
  );
  
  $conditions['ictpbx_condition_balance_topup'] = array(
    'label' => t('Balance Topup'),
    'group' => t('ICTPBX'),
    'parameter' => array(
      'order' => array('type' => 'uc_order', 'label' => t('Order')),
    ),
  );
  
  $conditions['ictpbx_condition_buy_did'] = array(
    'label' => t('Buy DID'),
    'group' => t('ICTPBX'),
    'parameter' => array(
      'order' => array('type' => 'uc_order', 'label' => t('Order')),
    ),
  );


  return $conditions;
}

function ictpbx_package_type($order) {
  foreach($order->products as $product) {
    if ($product->model == 'package1' || $product->model == 'package2' || $product->model == 'package3') {
      return true;
    }  
  }
  return false;
  //return ($product->model == $type) ? true : false;
} 

function ictpbx_condition_balance_topup($order) {
  foreach($order->products as $product) {
    if ($product->model == 'topup') {
      return true;
    }
  }
  return false;
}

function ictpbx_condition_buy_did($order) {
  foreach($order->products as $product) {
    if ($product->model == 'did') {
      return true;
    }
  }
  return false;
}


/**
 * Implements hook_rules_action_info().
 */
function ictpbx_rules_action_info() {
  // ICTPBX purchase package 
  $actions['ictpbx_order_renew'] = array(
    'label' => t('Update ictpbx user table'),
    'group' => t('ICTPBX'),
    'base' => 'ictpbx_action_order_renew',
    'parameter' => array(
      'order' => array(
        'type' => 'uc_order',
        'label' => t('Order'),
      ),
      'message' => array(
        'type' => 'boolean',
        'label' => t('Display messages to alert users of any new or updated roles.'),
      ),
    ),
  );
  
  // ICTPBX topup balance
  $actions['ictpbx_action_balance_topup'] = array(
    'label' => t('ICTPBX balance topup'),
    'group' => t('ICTPBX'),
    'base' => 'ictpbx_action_balance_topup',
    'parameter' => array(
      'order' => array(
        'type' => 'uc_order',
        'label' => t('Order'),
      ),
      'message' => array(
        'type' => 'boolean',
        'label' => t('Display messages to alert users of any new or updated roles.'),
      ),
    ),
  );
  
  // ICTPBX buy DID
  $actions['ictpbx_action_buy_did'] = array(
    'label' => t('Buy DID'),
    'group' => t('ICTPBX'),
    'base' => 'ictpbx_action_buy_did',
    'parameter' => array(
      'order' => array(
        'type' => 'uc_order',
        'label' => t('Order'),
      ),
      'message' => array(
        'type' => 'boolean',
        'label' => t('Display messages to alert users of any new or updated roles.'),
      ),
    ),
  );

  
  return $actions;
}


/**
 * Renews an order's product roles.
 *
 * This function updates expiration time on all roles found on all products
 * on a given order. First, the order user is loaded, then the order's products
 * are scanned for role product features. If any are found, the expiration time
 * of the role is set using the feature settings to determine the new length of
 * time the new expiration will last. An order comment is saved, and the user
 * is notified in Drupal, as well as through the email address associated with
 * the order.
 *
 * @param $order
 *   An Ubercart order object.
 * @param $message
 *   If TRUE, messages will be displayed to the user about the renewal.
 */
function ictpbx_action_order_renew($order, $message) {
  global $user;
  $uid = $user->uid;
  
  $ictpbx_user = db_query("SELECT * from {ictpbx_user} where uid=:uid", array(':uid'=>$user->uid))->fetchAssoc();
  $products = $order->products;
  $free_credit = 0;
  $free_bundle = 0;
  foreach($products as $product) {
    $package = $product->model;
    switch($product->model) {
      case 'package1':
        $free_bundle = variable_get('ictpbx_package1_free_faxes', '100');
        $free_credit = variable_get('ictpbx_package1_free_credit', '10');
        break;
      case 'package2':
        $free_bundle = variable_get('ictpbx_package2_free_faxes', '250');
        $free_credit = variable_get('ictpbx_package2_free_credit', '10');
        break;
      case 'package3':
        $free_bundle = variable_get('ictpbx_package3_free_faxes', '500');
        $free_credit = variable_get('ictpbx_package3_free_credit', '20');
        break;
    }
  }
  // First Remove any previous package that user has subscribed
  db_query("DELETE FROM {uc_roles_expirations} WHERE uid = :uid", array(':uid'=>$uid));
  // Also remove associated roles to the user
  $rid1 = array_search('package1', $user->roles);
  db_query("DELETE FROM {users_roles} WHERE uid = :uid AND rid = :rid", array(':uid'=>$uid, ':rid'=>$rid1));
  $rid2 = array_search('package2', $user->roles);
  db_query("DELETE FROM {users_roles} WHERE uid = :uid AND rid = :rid", array(':uid'=>$uid, ':rid'=>$rid2));
  $rid3 = array_search('package3', $user->roles);
  db_query("DELETE FROM {users_roles} WHERE uid = :uid AND rid = :rid", array(':uid'=>$uid, ':rid'=>$rid3));
  
  // use drupal_write_record to update user
  $ictpbx_user['active'] = 1;
  $ictpbx_user['credit'] = $free_credit; // for outgoing
  $ictpbx_user['free_bundle'] = $free_bundle;   // for incoming
  $ictpbx_user['package'] = $package;
  drupal_write_record('ictpbx_user', $ictpbx_user, 'ictpbx_user_id');
  
  // Also assign next available DID to the newly activated user
  $result = db_query("SELECT * from {ictpbx_did} where assigned_to IS NULL");
  if($ictpbx_did = $result->fetchAssoc()) {
    $ictpbx_did['assigned_to'] = $ictpbx_user['ictpbx_user_id'];
    drupal_write_record('ictpbx_did', $ictpbx_did, 'ictpbx_did_id');
  }
  drupal_set_message(t('You package is activated!'), 'status');
  
}

/*
 * @param $order
 *   An Ubercart order object.
 * @param $message
 *   If TRUE, messages will be displayed to the user about the renewal.
 */
function ictpbx_action_balance_topup($order, $message) {
  global $user; 
  $uid = $user->uid;
  $ictpbx_user = db_query("SELECT * from ictpbx_user WHERE uid=:uid", array(':uid'=>$uid))->fetchAssoc();
  // check if user is active means user has subscribed some package
  if($ictpbx_user['active'] == 1) {
    $balance = $ictpbx_user['credit'];
    if($balance == NULL) {
      $balance = 0;
    }
    $products = $order->products;
    foreach($products as $product) {
      if($product->model == 'topup') {
        $balance = $balance + $product->price;
      }
    }
    $ictpbx_user['credit'] = $balance;  
    drupal_write_record('ictpbx_user', $ictpbx_user, 'ictpbx_user_id');
    drupal_set_message(t('You package is re-charged!'), 'status');
  } else {
    drupal_set_message(t('You are not subscribed to any package!'), 'error');
  }
}

/*
 * @param $order
 *   An Ubercart order object.
 * @param $message
 *   If TRUE, messages will be displayed to the user about the renewal.
 */
function ictpbx_action_buy_did($order, $message) {
  global $user; 
  $uid = $user->uid;
  $did = variable_get('ictpbx_did_buy', null);
  if($did != null) {
    $ictpbx_did = db_query("SELECT * from ictpbx_did WHERE ictpbx_did_id =:ictpbx_did_id", array(':ictpbx_did_id'=>$did['ictpbx_did_id']))->fetchAssoc();
    if($ictpbx_did['assigned_to'] == null) {
      // assign the did to the user who selected it
      drupal_write_record('ictpbx_did', $did, 'ictpbx_did_id');
      drupal_set_message(t('You have purchased a new did!'), 'status');
      variable_set('ictpbx_did_buy', null);
    }
    else if ($ictpbx_did['assigned_to'] != null) {
      // select next available did to assign
    }
  }
}
