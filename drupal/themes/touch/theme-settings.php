<?php
/**
Insert option to enter facebook and twitter username
*/
function touch_form_system_theme_settings_alter(&$form, &$form_state) {
  $form['touch_settings']['twitter_username'] = array(
    '#type' => 'textfield',
    '#title' => t('Twitter Username'),
    '#default_value' => theme_get_setting('twitter_username'),
	'#description'   => t("Enter your Twitter username."),
  );
  $form['touch_settings']['facebook_username'] = array(
    '#type' => 'textfield',
    '#title' => t('Facebook Username'),
    '#default_value' => theme_get_setting('facebook_username'),
	'#description'   => t("Enter your Facebook username."),
  );
    $form['touch_settings']['footer_copyright'] = array(
    '#type' => 'checkbox',
    '#title' => t('Show copyright text in footer'),
    '#default_value' => theme_get_setting('footer_copyright'),
	'#description'   => t("Check this option to show copyright text in footer. Uncheck to hide."),
  );
    $form['touch_settings']['social_icons'] = array(
    '#type' => 'checkbox',
    '#title' => t('Show twitter, facebook, rss icons in header'),
    '#default_value' => theme_get_setting('social_icons'),
	'#description'   => t("Check this option to show ctwitter, facebook, rss icons in header. Uncheck to hide."),
  );
}
?>