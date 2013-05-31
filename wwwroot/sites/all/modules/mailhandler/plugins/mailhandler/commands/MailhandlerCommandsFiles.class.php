<?php
/**
 * @file
 * MailhandlerCommandsFiles class.
 */

class MailhandlerCommandsFiles extends MailhandlerCommands {

  /**
   * Parse attachments from message mimeparts.
   */
  function process(&$message, $source) {
    $message['attachments'] = array();

    foreach ($message['mimeparts'] as $attachment) {
      // 'unnamed_attachment' files are not really attachments, but mimeparts like HTML or Plain Text.
      // We only want to save real attachments, like images and files.
      if ($attachment->filename !== 'unnamed_attachment') {
        $destination = 'temporary://';
        $filename = mb_decode_mimeheader($attachment->filename);
        $file = file_save_data($attachment->data, $destination . $filename);
        $file->status = 0;
        drupal_write_record('file_managed', $file, 'fid');
        $message['attachments'][] = new FeedsEnclosure($file->uri, $attachment->filemime);
      }
    }
    unset($message['mimeparts']);
  }

  function getMappingSources($config) {
    $sources = array();
    $sources['attachments'] = array(
        'title' => t('Attachments'),
        'description' => t('Files attached to message.'),
    );
    return $sources;
  }
}
