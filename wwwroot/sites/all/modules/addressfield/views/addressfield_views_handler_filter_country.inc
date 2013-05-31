<?php

class addressfield_views_handler_filter_country extends views_handler_filter_in_operator {
  function get_value_options() {
    $this->value_title = t('Country');
    $field = field_info_field($this->definition['field_name']);
    $this->value_options = _addressfield_country_options_list($field);
  }
}