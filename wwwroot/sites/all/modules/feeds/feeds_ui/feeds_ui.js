
Drupal.behaviors.feeds = function() {

  // Export form machine-readable JS
  $('.feed-name:not(.processed)').each(function() {
    $('.feed-name')
      .addClass('processed')
      .after(' <small class="feed-id-suffix">&nbsp;</small>');
    if ($('.feed-id').val() === $('.feed-name').val().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/_+/g, '_') || $('.feed-id').val() === '') {
      $('.feed-id').parents('.form-item').hide();
      $('.feed-name').keyup(function() {
        var machine = $(this).val().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/_+/g, '_');
        if (machine !== '_' && machine !== '') {
          $('.feed-id').val(machine);
          $('.feed-id-suffix').empty().append(' Machine name: ' + machine + ' [').append($('<a href="#">'+ Drupal.t('Edit') +'</a>').click(function() {
            $('.feed-id').parents('.form-item').show();
            $('.feed-id-suffix').hide();
            $('.feed-name').unbind('keyup');
            return false;
          })).append(']');
        }
        else {
          $('.feed-id').val(machine);
          $('.feed-id-suffix').text('');
        }
      });
      $('.feed-name').keyup();
    }
  });

  // Hide text in specific input fields.
  $('.hide-text-on-focus').focus(function() {
    $(this).val('');
  });


  // Hide submit buttons of .feeds-ui-hidden-submit class.
  $('input.form-submit.feeds-ui-hidden-submit').hide();

  /**
   * Tune checkboxes on mapping forms.
   * @see feeds_ui_mapping_form() in feeds_ui.admin.inc
   */

  // Attach submit behavior to elements with feeds-ui-trigger-submit class.
  $('.feeds-ui-trigger-submit').click(function() {
    // Use click, not form.submit() - submit() would use the wrong submission
    // handler.
    $('input.form-submit.feeds-ui-hidden-submit').click();
  });

  // Replace checkbox with .feeds-ui-checkbox-link class with a link.
  $('.feeds-ui-checkbox-link:not(.processed)').each(function(i) {
    $(this).addClass('processed').after(
      '<a href="#" onclick="return false;" class="feeds-ui-trigger-remove">' + $('label', this).text() + '</a>'
    ).hide();
  });

  // Check the box and then submit.
  $('.feeds-ui-trigger-remove').click(function() {
    // Use click, not form.submit() - submit() would use the wrong submission
    // handler.
    $(this).prev().children().children().children().attr('checked', 1);
    $('input.form-submit.feeds-ui-hidden-submit').click();
  });

  // Replace radio with .feeds-ui-radio-link class with a link.
  $('.feeds-ui-radio-link:not(.processed)').parent().each(function(i) {
    checked = '';
    if ($(this).children('input').attr('checked')) {
      checked = ' checked';
    }
    $(this).addClass('processed').after(
      '<a href="#" onclick="return false;" class="feeds-ui-check-submit' + checked + '" id="' + $(this).children('input').attr('id') + '">' + $(this).parent().text() + '</a>'
    );
    $(this).hide();
  });

  // Hide the the radio that is selected.
  $('.feeds-ui-check-submit.checked').parent().hide();

  // Check the radio and then submit.
  $('.feeds-ui-check-submit').click(function() {
    // Use click, not form.submit() - submit() would use the wrong submission
    // handler.
    $('#' + $(this).attr('id')).attr('checked', 1);
    $('input.form-submit.feeds-ui-hidden-submit').click();
  });
};
