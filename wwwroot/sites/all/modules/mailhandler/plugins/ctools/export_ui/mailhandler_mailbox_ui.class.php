<?php
/**
 * @file
 * Definition of mailhandler_mailbox_ui class.
 */

/**
 * Represents an email mailbox (IMAP, POP3, etc...).
 *
 * Intended to be used as a source for a Feeds Importer using the Mailhandler
 * Fetcher.
 */
class mailhandler_mailbox_ui extends ctools_export_ui {

  /**
   * Implements ctools_export_ui::edit_form().
   */
  function edit_form(&$form, &$form_state) {
    parent::edit_form($form, $form_state);
    $retrieve_plugins = mailhandler_get_plugins('mailhandler', 'retrieve');
    if (count($retrieve_plugins) == 1) {
      drupal_set_message(t('No retrieval plugins are available. Please <a href="@module-page">enable a module</a> providing a retrieval plugin, such as the Mailhandler PHP IMAP module.', array('@module-page' => url('admin/modules'))), 'warning');
    }
    global $cookie_domain;
    extract($form_state['item']->settings);
    $form['info']['admin_title']['#description'] = t('Suggested, but not required, to be the email address of the mailbox.');
    $form['connection']['#tree'] = FALSE;
    $form['connection']['settings']= array(
      '#type' => 'fieldset',
      '#title' => 'Mailbox connection settings',
      '#tree' => TRUE,
      '#collapsible' => TRUE,
    );
    $form['connection']['settings']['type'] = array(
      '#type' => 'select',
      '#title' => t('Protocol'),
      '#options' => array('imap' => 'IMAP', 'pop3' => 'POP3', 'local' => 'Local mbox file'),
      '#default_value' => $type,
      '#description' => t('You can use the IMAP/POP3 protocols, or retrieve from an mbox file on the local file system.'),
    );
    $ajax_settings = array(
      'callback' => '_mailhandler_mailbox_test',
      'wrapper' => 'mailhandler_test_results',
      'event' => 'change',
      'progress' => array(
        'type' => 'throbber',
        'message' => t('Please wait - testing connection settings...'),
      ),
    );
    $form['connection']['settings']['folder'] = array(
      '#type' => 'textfield',
      '#title' => t('Folder'),
      '#default_value' => $folder,
      '#description' => t('The folder where the mail is stored. If you want this mailbox to read from a local mbox file, give the path relative to the Drupal installation directory.'),
      '#ajax' => $ajax_settings,
    );
    $form['connection']['settings']['domain'] = array(
      '#type' => 'textfield',
      '#title' => t('Domain'),
      '#default_value' => $domain ? $domain : trim($cookie_domain, '.'),
      '#description' => t('The domain of the server used to collect mail.'),
      '#ajax' => $ajax_settings,
    );
    $form['connection']['settings']['port'] = array(
      '#type' => 'textfield',
      '#title' => t('Port'),
      '#size' => 5,
      '#maxlength' => 5,
      '#default_value' => $port,
      '#description' => t('The mailbox port number (usually 110 for POP3, 143 for IMAP).'),
      '#element_validate' => array('element_validate_integer_positive'),
      '#ajax' => $ajax_settings,
    );
    $form['connection']['settings']['name'] = array(
      '#type' => 'textfield',
      '#title' => t('Username'),
      '#default_value' => $name,
      '#description' => t('This username is used while logging into this mailbox during mail retrieval.'),
      '#ajax' => $ajax_settings,
    );
    $form['connection']['settings']['pass'] = array(
      '#type' => 'textfield',
      '#title' => t('Password'),
      '#default_value' => $pass,
      '#description' => t('The password corresponding to the username above. Consider using a non-vital password, since this field is stored without encryption in the database.'),
      '#ajax' => $ajax_settings,
    );
    // Allow administrators to configure the mailbox with extra IMAP commands (notls, novalidate-cert etc.)
    $form['connection']['settings']['extraimap'] = array(
      '#type' => 'textfield',
      '#title' => t('Extra commands'),
      '#default_value' => $extraimap,
      '#description' => t('In some circumstances you need to issue extra commands to connect to your mail server (e.g. "/notls", "/novalidate-cert" etc.). See documentation for <a href="@imap-open">imap_open</a>.', array('@imap-open' => url('http://php.net/imap_open'))),
      '#ajax' => $ajax_settings,
    );
    $form['connection']['settings']['results'] = array(
      '#type' => 'container',
      '#attributes' => array(
        'id' => 'mailhandler_test_results',
      ),
    );
    $form['extra']['#tree'] = FALSE;
    $form['extra']['settings']= array(
      '#type' => 'fieldset',
      '#title' => 'More settings',
      '#tree' => TRUE,
      '#collapsible' => TRUE,
      '#collapsed' => TRUE,
    );
    $form['extra']['settings']['limit'] = array(
      '#type' => 'textfield',
      '#title' => t('Maximum messages to retrieve'),
      '#size' => 5,
      '#maxlength' => 5,
      '#default_value' => $limit,
      '#description' => t('To prevent timeout errors from large mailboxes you can limit the maximum number of messages that will be retrieved during each cron run. Set to zero for no limit.'),
      '#element_validate' => array('element_validate_integer'),
    );
    $form['extra']['settings']['encoding'] = array(
      '#type' => 'textfield',
      '#title' => t('Default character encoding'),
      '#default_value' => $encoding,
      '#description' => t('The default character encoding to use when an incoming message does not define an encoding.'),
    );
    $form['extra']['settings']['delete_after_read'] = array(
      '#type' => 'checkbox',
      '#title' => t('Delete messages after they are processed?'),
      '#default_value' => $delete_after_read,
      '#description' => t('Uncheck this box to leave read messages in the mailbox. They will not be processed again unless they become marked as unread.  If you selected "POP3" as your mailbox type, you must check this box.'),
    );
    $form['extra']['settings']['fromheader'] = array(
      '#type' => 'textfield',
      '#title' => t('From header'),
      '#default_value' => $fromheader,
      '#description' => t('Use this e-mail header to determine the author of the resulting node. <strong>Sender</strong> is useful when working with listservs.'),
    );
    $form['extra']['settings']['security'] = array(
      '#type' => 'radios',
      '#title' => t('Security'),
      '#options' => array(t('Disabled'), t('Require password')),
      '#default_value' => $security,
      '#description' => t('Disable security if your site does not require a password in the Commands section of incoming e-mails. Note: Security=Enabled and MIME preference=HTML is an unsupported combination.'),
    );
    $form['extra']['settings']['replies'] = array(
      '#type' => 'radios',
      '#title' => t('Send error replies'),
      '#options' => array(t('Disabled'), t('Enabled')),
      '#default_value' => $replies,
      '#description' => t('Send helpful replies to all unsuccessful e-mail submissions. Consider disabling when a listserv posts to this mailbox.'),
    );
    $form['extra']['settings']['retrieve'] = array(
      '#type' => 'select',
      '#title' => t('Retrieval library'),
      '#options' => _mailhandler_build_options($retrieve_plugins),
      '#default_value' => $retrieve,
      '#description' => t('The library that will be used to retrieve messages.'),
      '#required' => TRUE,
    );
  }

  /**
   * Implements ctools_export_ui::edit_form_validate().
   */
  function edit_form_validate(&$form, &$form_state) {
    parent::edit_form_validate($form, $form_state);

    _mailhandler_mailbox_test($form, $form_state);

    // If POP3 mailbox is chosen, messages should be deleted after processing.
    // Do not set an actual error because this is helpful for testing purposes.
    if ($form_state['values']['settings']['type'] == 'pop3' && $form_state['values']['settings']['delete_after_read'] == 0) {
      drupal_set_message(t('Unless you check off "Delete messages after they are processed" when using a POP3 mailbox, old emails will be re-imported each time the mailbox is processed. You can partially prevent this by mapping Message ID to a unique target in the processor configuration - see INSTALL.txt or advanced help for more information'), 'warning');
    }

    // Dummy library is only for testing.
    if ($form_state['values']['settings']['retrieve'] == 'MailhandlerRetrieveDummy') {
      drupal_set_message(t('Because you selected the dummy retrieval library, Mailhandler will not import any messages. Please select another retrieval library, such as the PHP IMAP library.'), 'warning');
    }
  }

  function edit_form_submit(&$form, &$form_state) {
    parent::edit_form_submit($form, $form_state);
    if (module_exists('mailhandler_default')) {
      drupal_set_message(t("Now that you've created a mailbox, send it a test email and try to <a href='@import-page'>create a source node</a> to start importing messages.", array('@import-page' => url('node/add/mailhandler-source'))));
    }
    else {
      drupal_set_message(t("Now that you've created a mailbox, you'll need to <a href='@importer-add'>create a Feeds importer</a> or <a href='@import-page'>run an existing importer</a>. Consider <a href='@module-page'>enabling the Mailhandler quick-start</a> module.", array('@importer-add' => url('admin/structure/feeds/add'), '@import-page' => url('import'), '@module-page' => url('admin/modules'))));
    }
  }

  function list_header($form_state) {
    if (isset($form_state['input']['test_result'])) {
      return $form_state['input']['test_result'];
    }
  }

  /**
   * Callback to test a mailbox connection.
   */
  function test_page($js, $input, $mailbox) {
    $input['test_result'] = _mailhandler_mailbox_test_output($mailbox);
    if (!$js) {
      drupal_goto(ctools_export_ui_plugin_base_path($this->plugin));
    }
    else {
      return $this->list_page($js, $input);
    }
  }
}
