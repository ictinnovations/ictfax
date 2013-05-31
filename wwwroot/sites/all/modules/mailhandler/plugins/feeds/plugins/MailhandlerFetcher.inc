<?php

/**
 * @file
 * Checks for new messages in a mailbox (IMAP, POP3, etc...).
 */

$plugin = array(
  'name' => 'Mailhandler fetcher',
  'description' => 'Connects to an IMAP/POP mailbox.',
  'handler' => array(
    'parent' => 'FeedsFetcher',
    'class' => 'MailhandlerFetcher',
  ),
);

/**
 * Definition of the import batch object needed by MailhandlerFetcher.
 */
class MailhandlerFetcherResult extends FeedsFetcherResult {
  protected $mailbox;
  protected $filter;

  /**
   * Constructor.
   */
  public function __construct($mailbox, $filter) {
    $this->mailbox = $mailbox;
    $this->filter = $filter;
    parent::__construct('');
  }

  /**
   * Implementation of FeedsImportBatch::getRaw();
   */
  public function getRaw() {
    $mailbox = mailhandler_mailbox_load($this->mailbox);
    if ($class = mailhandler_plugin_load_class('mailhandler', $mailbox->settings['retrieve'], 'retrieve', 'handler')) {
      if ($messages = $class->retrieve($mailbox, $this->filter)) {
        return array('messages' => $messages, 'mailbox' => $mailbox);
      }
    }
  }
}

class MailhandlerFetcher extends FeedsFetcher {

  /**
   * Implementation of FeedsFetcher::fetch().
   */
  public function fetch(FeedsSource $source) {
    $source_config = $source->getConfigFor($this);
    return new MailhandlerFetcherResult($source_config['mailbox'], $this->config['filter']);
  }

  /**
   * Source form.
   */
  public function sourceForm($source_config) {
    $form = array();
    $form['mailbox'] = array(
      '#type' => 'select',
      '#title' => t('Mailbox'),
      '#description' => t('Select a mailbox to use'),
      '#default_value' => isset($source_config['mailbox']) ? $source_config['mailbox'] : '',
      '#options' => _mailhandler_build_options(mailhandler_mailbox_load_all(FALSE), 'admin_title'),
    );
    return $form;
  }

  /**
   * Override parent::configDefaults().
   */
  public function configDefaults() {
    return array(
      'filter' => 'MailhandlerFilters',
    );
  }

  /**
   * Config form.
   */
  public function configForm(&$form_state) {
    $form = array();
    // Select message filter (to differentiate nodes/comments/etc)
    $form['filter'] = array(
      '#type' => 'select',
      '#title' => t('Message filter'),
      '#description' => t('Select which types of messages to import'),
      '#default_value' => $this->config['filter'],
      '#options' => _mailhandler_build_options(mailhandler_get_plugins('mailhandler', 'filters')),
    );
    return $form;
  }

}
