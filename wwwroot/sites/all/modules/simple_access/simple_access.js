
(function ($) {

Drupal.behaviors.simple_accessFieldsetSummaries = {
  attach: function (context) {
    $('fieldset#edit-simple-access').drupalSetSummary(function (context) {
      if (!$('.form-checkbox:checked', context).size()) {
        return Drupal.t('Public access');
      }
      else {
        return Drupal.t('Restricted access');
      }
    });
  }
};

})(jQuery);
