<?php
/**
 * @file
 * MailhandlerCommandsHeaders class.
 */

class MailhandlerCommandsHeaders extends MailhandlerCommands {

  /**
   * Set known sources and parse additional sources from body.
   */
  function process(&$message, $source) {
    // Populate $message with all values from 'header' object.
    $parts = (array) $message['header'];
    foreach ($parts as $key => $value) {
      // Some keys are already taken, so do not overwrite them.
      if (!in_array($key, array('header', 'body_text', 'body_html', 'mimeparts', 'mailbox', 'attachments'))) {
        if (in_array($key, array('Subject', 'subject'))) {
          $message[$key] = iconv_mime_decode($value, 0, "UTF-8");
        }
        else {
          $message[$key] = $value;
        }
      }
    }
  }

  function getMappingSources($config) {
    $sources = array();
    // Make all IMAP header keys available as selectable mapping sources.
    $parts = array(
      'date',
      'subject',
      'message_id',
      'toaddress',
      'to',
      'fromaddress',
      'from',
      'reply_toaddress',
      'reply_to',
      'senderaddress',
      'sender',
      'ccaddress',
      'cc',
      'bccaddress',
      'bcc',
      'Recent',
      'Unseen',
      'Flagged',
      'Answered',
      'Deleted',
      'Draft',
      'Msgno',
      'MailDate',
      'Size',
      'udate',
    );
    foreach ($parts as $part) {
      $sources[$part] = array(
        'title' => t($part),
        'description' => t('IMAP header property.'),
      );
    }
    return $sources;
  }
}
