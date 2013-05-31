<?php

/**
 * @file
 * Default Rules configurations for ictpbx.module.
 */

/**
 * Implements hook_defualt_rules_configuration().
 */
function ictpbx_default_rules_configuration() {
  $configs = array();

  // Renew all the roles on an order when the status matches what's set
  // in the roles admin settings.
  $rule = rules_reaction_rule();
  $rule->label = t('Update ICTPBX User table');
  $rule->active = TRUE;
  $rule->event('uc_order_status_update');
  $rule->condition('data_is', array('data:select' => 'updated_order:order-status', 'value' => 'completed'));
  //$rule->condition('uc_order_condition_has_products', array('order:select' => 'order', 'products'=>'package1, package2, package3', 'required'=> false, 'forbidden'=> false));
  $rule->condition('ictpbx_package_type', array('order:select' => 'updated_order'));
  $rule->action('ictpbx_order_renew', array('order:select' => 'updated_order', 'message' => FALSE));
  $configs['ictpbx_renewal'] = $rule;
  

  // Add Topup balance to ictpbx user table 
  $rule = rules_reaction_rule();
  $rule->label = t('Add Topup in ICTPBX user table');
  $rule->active = TRUE;
  $rule->event('uc_order_status_update');
  $rule->condition('data_is', array('data:select' => 'updated_order:order-status', 'value' => 'completed'));
  $rule->condition('ictpbx_condition_balance_topup', array('order:select' => 'updated_order'));
  $rule->action('ictpbx_action_balance_topup', array('order:select' => 'updated_order', 'message' => FALSE));
  $configs['ictpbx_topup'] = $rule;


  // Buy DID 
  $rule = rules_reaction_rule();
  $rule->label = t('Buy DID');
  $rule->active = TRUE;
  $rule->event('uc_order_status_update');
  $rule->condition('data_is', array('data:select' => 'updated_order:order-status', 'value' => 'completed'));
  $rule->condition('ictpbx_condition_buy_did', array('order:select' => 'updated_order'));
  $rule->action('ictpbx_action_buy_did', array('order:select' => 'updated_order', 'message' => FALSE));
  $configs['ictpbx_buy_did'] = $rule;

  return $configs;
}



