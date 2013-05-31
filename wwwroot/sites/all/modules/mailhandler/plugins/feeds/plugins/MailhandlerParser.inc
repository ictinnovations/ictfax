<?php
/**
 * @file
 * MailhandlerParser class.
 */

$plugin = array(
  'name' => 'Mailhandler IMAP stream parser',
  'description' => 'Parses an IMAP stream.',
  'handler' => array(
    'parent' => 'FeedsParser',
    'class' => 'MailhandlerParser',
  ),
);

/**
 * Parses an IMAP stream.
 */
class MailhandlerParser extends FeedsParser {

  /**
   * Override parent::configDefaults().
   */
  public function configDefaults() {
    return array(
      'default_commands' => 'status: 1',
      'commands_failed_auth' => 'status: 0',
      'available_commands' => 'status',
      'command_plugin' => array('MailhandlerCommandsDefault', 'MailhandlerCommandsFiles', 'MailhandlerCommandsHeaders'),
      'authenticate_plugin' => 'MailhandlerAuthenticateDefault',
    );
  }

  public function sourceForm($source_config) {
    $form['auth_required'] = array(
      '#type' => 'checkbox',
      '#title' => t('Abort import if authentication fails'),
      '#default_value' => isset($source_config['auth_required']) ? $source_config['auth_required'] : TRUE,
      '#description' => t('If checked, an exception will be thrown if incoming emails do not belong to an authenticated user.'),
    );
    return $form;
  }

  /**
   * Build configuration form.
   */
  public function configForm(&$form_state) {
    $form = array();
    ctools_include('plugins');
    $form['command_plugin'] = array(
      '#type' => 'select',
      '#title' => t('Command plugins'),
      '#description' => t('Choose the command plugins to use'),
      '#options' => _mailhandler_build_options(mailhandler_get_plugins('mailhandler', 'commands')),
      '#multiple' => TRUE,
      '#default_value' => $this->config['command_plugin'],
    );
    $form['authenticate_plugin'] = array(
      '#type' => 'select',
      '#title' => t('Authentication plugin'),
      '#description' => t('Choose an authentication plugin'),
      '#options' => _mailhandler_build_options(mailhandler_get_plugins('mailhandler', 'authenticate')),
      '#default_value' => $this->config['authenticate_plugin'],
      '#required' => FALSE,
    );
    if (($plugins = $this->config['command_plugin']) && is_array($plugins) && !empty($plugins)) {
      foreach ($plugins as $plugin) {
        if ($class = mailhandler_plugin_load_class('mailhandler', $plugin, 'commands', 'handler')) {
          $class->configForm($form, $form_state, $this->config);
        }
      }
    }
    return $form;
  }

  /**
   * Implementation of FeedsParser::parse().
   */
  public function parse(FeedsSource $source, FeedsFetcherResult $fetcher_result) {
    $fetched = $fetcher_result->getRaw();
    $mailbox = $fetched['mailbox'];
    $result = new FeedsParserResult();
    if (!empty($fetched['messages'])) {
      foreach ($fetched['messages'] as $mid => &$message) {
        $this->authenticate($message, $mailbox);
        if ($message['authenticated_uid'] == 0) {
          // User was not authenticated
          module_invoke_all('mailhandler_auth_failed', $message);
          $source_config = $source->getConfigFor($this);
          if ($source_config['auth_required']) {
            throw new Exception('User could not be authenticated. Please check your Mailhandler authentication plugin settings.');
          }
        }
        if ($class = mailhandler_plugin_load_class('mailhandler', $mailbox->settings['retrieve'], 'retrieve', 'handler')) {
          $class->purge_message($mailbox, $message);
        }
        $this->commands($message, $source);
        $result->items[] = $message;
      }
    }
    return $result;
  }

  /*
   * This defines sources which user's can select to map values to.
   */
  public function getMappingSources() {
    $sources = parent::getMappingSources();
    $sources['authenticated_uid'] = array(
      'name' => t('User ID'),
      'description' => t('The authenticated Drupal user ID'),
    );
    $plugins = $this->config['command_plugin'];
    foreach ($plugins as $plugin_name) {
      $plugin = mailhandler_plugin_load_class('mailhandler', $plugin_name, 'commands', 'handler');
      $sources = array_merge($sources, $plugin->getMappingSources($this->config));
    }
    return $sources;
  }

  /*
   * Parse and apply commands.
   */
  public function commands(&$message, $source) {
    if (($plugins = $this->config['command_plugin']) && is_array($plugins) && !empty($plugins)) {
      foreach ($plugins as $plugin) {
        if ($class = mailhandler_plugin_load_class('mailhandler', $plugin, 'commands', 'handler')) {
          $class->parse($message, $source);
          $class->process($message, $source);
        }
      }
    }
  }

  /*
   * Authenticate the message and set $message['authenticated_uid'].
   */
  public function authenticate(&$message, $mailbox) {
    if ($plugin = $this->config['authenticate_plugin']) {
      if ($class = mailhandler_plugin_load_class('mailhandler', $plugin, 'authenticate', 'handler')) {
        $message['authenticated_uid'] = $class->authenticate($message, $mailbox);
      }
    }
  }
}
