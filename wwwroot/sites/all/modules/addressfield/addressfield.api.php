<?php

/**
 * @file
 * API documentation for Addressfield.
 */

/**
 * Format generation callback.
 *
 * @param $format
 *   The address format being generated.
 * @param $address
 *   The address this format is generated for.
 * @param $context
 *   An array of context arguments:
 *     - 'mode': can be either 'form' or 'render'
 *     - (optional) 'field': when generated for a field, the field
 *     - (optional) 'instance': when generated for a field, the field instance
 *     - (optional) 'langcode': when generated for a field, the langcode
 *       this field is being rendered in.
 *     - (optional) 'delta': when generated for a field, the delta of the
 *       currently handled address.
 *
 * @ingroup addressfield_format
 */
function CALLBACK_addressfield_format_callback(&$format, $address, $context = array()) {
  
}
