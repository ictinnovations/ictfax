<?php

/**
 * @file
 * Implements PHPMailer support on behalf of Mime Mail module.
 */

/**
 * Send out an e-mail.
 *
 * @param $message
 *   Mime Mail message array.
 */
function mimemail_phpmailer_send($message) {
  static $mail;

  if (!isset($mail)) {
    $mail = new DrupalPHPMailer();
    // Keep linefeed style in sync.
    $mail->LE = variable_get('mimemail_crlf', "\n");
  }

  try {
    // Extract and assign e-mail addresses required for SMTP.
    // Display names are usually not required. Leave header intact.

    // Parse 'From' e-mail address.
    $from = phpmailer_parse_address($message['from']);
    $from = reset($from);
    $mail->From = $from['mail'];
    if ($from['name'] != '') {
      $mail->FromName = $from['name'];
    }

    if (variable_get('phpmailer_debug_email', '') === '') {
      // Set recipients.
      foreach (phpmailer_parse_address($message['to']) as $address) {
        $mail->AddAddress($address['mail']);
      }
      // Extract CCs and BCCs from headers.
      if (isset($message['headers']['Cc'])) {
        foreach (phpmailer_parse_address($message['headers']['Cc']) as $address) {
          $mail->AddCC($address['mail']);
        }
      }
      if (isset($message['headers']['Bcc'])) {
        foreach (phpmailer_parse_address($message['headers']['Bcc']) as $address) {
          $mail->AddBCC($address['mail']);
        }
      }
    }
    else {
      // Reroute to debug e-mail address.
      $message['to'] = variable_get('phpmailer_debug_email', '');
      $mail->AddAddress($message['to']);
    }
    unset($message['headers']['Cc'], $message['headers']['Bcc']);

    $message['headers']['Date'] = $mail->RFCDate();

    if ($message['to']) {
      $message['headers']['To'] = $message['to'];
    }

    // If no Reply-To header has been explicitly set, use the From address to be
    // able to respond to e-mails sent via Google Mail.
    if (!isset($message['headers']['Reply-To']) && variable_get('smtp_always_replyto', FALSE)) {
      $message['headers']['Reply-To'] = $from['mail'];
    }

    $message['headers']['Subject'] = $message['subject'];

    // FIXME SpamAssassin says INVALID_MSGID to PHPMailer's generated Message-ID. 06/04/2009 smk
//    if (!isset($message['headers']['Message-ID'])) {
//      $message['headers']['Message-ID'] = sprintf("<%s@%s>", md5(uniqid(time())), $mail->ServerHostname());
//    }

    $header = mimemail_rfc_headers($message['headers']) . $mail->LE . $mail->LE;

    return $mail->SmtpSend($header, $message['body']);
  }
  catch (phpmailerException $e) {
    drupal_set_message(t('Sending of at least one e-mail failed. The error returned was:<br />@error.', array('@error' => $e->getMessage())), 'error');
    watchdog('phpmailer', $e->getMessage(), NULL, WATCHDOG_ERROR);
    return FALSE;
  }
}

