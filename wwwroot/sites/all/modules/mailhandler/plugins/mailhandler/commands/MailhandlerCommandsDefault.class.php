<?php
/**
 * @file
 * MailhandlerCommandsDefault class.
 */

class MailhandlerCommandsDefault extends MailhandlerCommands {

  /**
   * Parse commands from email body.
   *
   * @param $message
   *   Message including body fields.
   * @param $source
   *   Source config.
   */
  public function parse(&$message, $source) {
    $config = $source->importer->getConfig();
    // Prepend the default commands.
    // User-added commands will override the default commands.
    if ($config['parser']['config']['default_commands']) {
      $message['body_text'] = trim($config['parser']['config']['default_commands']) . "\n" . $message['body_text'];
    }
    $commands = $this->getCommands($message['body_text']);
    $this->commands = $commands;
    foreach ($commands as $key => $value) {
      $message['body_html'] = preg_replace('/' . $key . ': ' . $value . '/', '', $message['body_html'], 1);
      $message['body_html'] = preg_replace('/<br[^>\r\n]*>/', '', $message['body_html'], 1);
    }
    if ($message['authenticated_uid'] == 0) {
      $commands = $this->getCommands($config['parser']['config']['commands_failed_auth']);
      foreach ($commands as $key => $value) {
        if (isset($this->commands[$key])) {
          $this->commands[$key] = $value;
        }
      }
    }
  }

  /**
   * Parse and process commands.
   */
  function process(&$message, $source) {
    if (!empty($this->commands)) {
      foreach ($this->commands as $key => $value) {
        if (drupal_substr($value, 0, 1) == '[' && drupal_substr($value, -1, 1) == ']') {
          // Strip brackets.
          $value = rtrim(ltrim($value, '['), ']');
          $value = explode(',', $value);
        }
        $key = drupal_strtolower(str_replace(' ', '_', $key));
        if (!empty($key)) {
          $message[$key] = $value;
        }
      }
    }
  }

  /**
   * Build configuration form.
   */
  public function configForm(&$form, &$form_state, $config) {
    $form['available_commands'] = array(
      '#type' => 'textarea',
      '#title' => t('Available commands'),
      '#description' => t('A set of commands that can be mapped to Feeds processor targets.'),
      '#default_value' => $config['available_commands'],
    );
    $form['default_commands'] = array(
      '#type' => 'textarea',
      '#title' => t('Default commands (authenticated users)'),
      '#description' => t('A set of commands that are added to each message by default, if the user is authenticated. Should be in the form "key: value".'),
      '#default_value' => $config['default_commands'],
    );
    $form['commands_failed_auth'] = array(
      '#type' => 'textarea',
      '#title' => t('Default commands (anonymous users)'),
      '#description' => t('A set of commands that are added to each message by default, if the user is not authenticated. Should be in the form "key: value".'),
      '#default_value' => $config['commands_failed_auth'],
    );
  }

  function getMappingSources($config) {
    $sources = array();
    $sources['body_text'] = array(
      'name' => t('Body (Text)'),
      'description' => t('Plain-text message body. Will fall back to HTML body if necessary.'),
    );
    $sources['body_html'] = array(
      'name' => t('Body (HTML)'),
      'description' => t('HTML message body. Will fall back to text body if necessary.'),
    );
    $available_commands = explode("\n", $config['available_commands']);
    foreach ($available_commands as $command) {
      $command = trim($command);
      $sources[$command] = array(
        'name' => $command,
        'description' => $command . ' (commanded)',
      );
    }
    return $sources;
  }

  function getCommands(&$string) {
    $commands = array();
    $endcommands = NULL;
    // Collect the commands and locate signature.
    $lines = explode("\n", $string);
    foreach ($lines as $i => $line) {
      $line = explode(':', $line);
      if (count($line) == 2) {
        $key = trim($line[0]);
        $value = trim($line[1]);
        $commands[$key] = $value;
      }
      elseif (!empty($commands) || $i == 0) {
        $endcommands = $i;
        break;
      }
    }
    $string = implode("\n", array_slice($lines, $endcommands));
    return $commands;
  }

}
