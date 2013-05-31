<?php

/**
 * @file
 * views_handler_filter_countries_continents_list.inc
 */

/**
 * Filter by continent code.
 */
class views_handler_filter_countries_continents_list extends views_handler_filter_in_operator {
  function get_value_options() {
    $this->value_options = countries_get_continents();
  }
}
