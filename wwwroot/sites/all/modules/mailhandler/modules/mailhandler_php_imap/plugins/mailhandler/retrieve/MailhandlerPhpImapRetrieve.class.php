<?php
/**
 * @file
 * Definition of MailhandlerPhpImapRetrieve class.
 */

/**
 * Retrieve messages using PHP IMAP library.
 */
class MailhandlerPhpImapRetrieve extends MailhandlerRetrieve {

  /**
   * Connect to mailbox and run message retrieval.
   *
   * @param object $mailbox
   *   The mailbox to retrieve from.
   * @param string|null $filter_name
   *   (optional) Mailhandler filter to restrict what messages are retrieved.
   *
   * @return array
   *   Retrieved messages.
   */
  function retrieve($mailbox, $filter_name = 'MailhandlerFilters') {
    extract($mailbox->settings);
    if ($result = $this->open_mailbox($mailbox)) {
      $new = $this->get_unread_messages($result, $mailbox);
    }
    else {
      imap_errors();
      throw new Exception(t('Unable to connect to %mail. Please check the <a href="@mailbox-edit">connection settings</a> for this mailbox.', array('%mail' => $mailbox->mail, '@mailbox-edit' => url('admin/structure/mailhandler/list/' . $mailbox->mail . '/edit'))));
    }
    $messages = array();
    $retrieved = 0;
    while ($new && (!$limit || $retrieved < $limit)) {
      $message = $this->retrieve_message($result, $mailbox, array_shift($new), $filter_name);
      if ($message) {
        $messages[] = $message;
      }
      $retrieved++;
    }
    watchdog('mailhandler', 'Mailbox %mail was checked and contained %retrieved messages.', array('%mail' => $mailbox->admin_title, '%retrieved' => $retrieved), WATCHDOG_INFO);
    $this->close_mailbox($result);
    return $messages;
  }

  /**
   * Test connection to a mailbox.
   *
   * @param object $mailbox
   *   The mailbox to test.
   *
   * @return array
   *   Test results.
   */
  function test($mailbox) {
    extract($mailbox->settings);
    $ret = array();

    $is_local = ($type == 'local');
    $folder_is_set = (!empty($folder) && $folder != 'INBOX');
    $connect_is_set = !empty($domain) && !empty($port) && !empty($name) && !empty($pass);

    if (($is_local && $folder_is_set) || (!$is_local && $connect_is_set)) {
      if ($result = $this->open_mailbox($mailbox)) {
        $ret[] = array('severity' => 'status', 'message' => t('Mailhandler was able to connect to the mailbox.'));
        $box = $this->mailbox_string($mailbox);
        $status = imap_status($result, $box, SA_MESSAGES);
        if ($status) {
          $ret[] = array('severity' => 'status', 'message' => t('There are @messages messages in the mailbox folder.', array('@messages' => $status->messages)));
        }
        else {
          $ret[] = array('severity' => 'warning', 'message' => t('Mailhandler could not open the specified folder'));
        }
        $this->close_mailbox($result);
      }
      else {
        imap_errors();
        $ret[] = array('severity' => 'error', 'message' => t('Mailhandler could not access the mailbox using these settings'));
      }
    }
    return $ret;
  }

  function purge_message($mailbox, $message) {
    if (isset($message['imap_uid'])) {
      if ($result = $this->open_mailbox($mailbox)) {
        if ($mailbox->settings['delete_after_read']) {
          imap_delete($result, $message['imap_uid'], FT_UID);
        }
        else {
          imap_setflag_full($result, (string)$message['imap_uid'], '\Seen', FT_UID);
        }
        $this->close_mailbox($result);
      }
      else {
        drupal_set_message(t('Unable to connect to mailbox.'));
        watchdog('mailhandler', 'Unable to connect to %mail', array('%mail' => $mailbox->mail), WATCHDOG_ERROR);
      }
    }
  }

  /**
   * Establish IMAP stream connection to specified mailbox.
   *
   * @param $mailbox
   *   Array of mailbox configuration.
   * @return
   *   IMAP stream.
   */
  function open_mailbox($mailbox) {
    extract($mailbox->settings);

    $box = $this->mailbox_string($mailbox);
    if ($type != 'local') {
      $result = imap_open($box, $name, $pass, NULL, 1);
    }
    else {
      $orig_home = getenv('HOME');
      $new_home = $_SERVER['DOCUMENT_ROOT'];
      putenv("HOME=$new_home");
      $result = imap_open($box, '', '', NULL, 1);
      putenv("HOME=$orig_home");
    }
    return $result;
  }

  /**
   * Constructs a mailbox string based on mailbox object
   */
  function mailbox_string($mailbox) {
    extract($mailbox->settings);

    switch ($type) {
      case 'imap':
        return '{' . $domain . ':' . $port . $extraimap . '}' . $folder;
      case 'pop3':
        return '{' . $domain . ':' . $port . '/pop3' . $extraimap . '}' . $folder;
      case 'local':
        return $folder;
    }
  }

  /**
   * Returns the first part with the specified mime_type
   *
   * USAGE EXAMPLES - from php manual: imap_fetch_structure() comments
   * $data = get_part($stream, $msg_number, "TEXT/PLAIN"); // get plain text
   * $data = get_part($stream, $msg_number, "TEXT/HTML"); // get HTML text
   */
  function get_part($stream, $msg_number, $mime_type, $structure = FALSE, $part_number = FALSE, $encoding) {
    if (!$structure) {
      $structure = imap_fetchstructure($stream, $msg_number);
    }
    if ($structure) {
      foreach ($structure->parameters as $parameter) {
        if (drupal_strtoupper($parameter->attribute) == 'CHARSET') {
          $encoding = $parameter->value;
        }
      }
      if ($mime_type == $this->get_mime_type($structure)) {
        if (!$part_number) {
          $part_number = '1';
        }
        $text = imap_fetchbody($stream, $msg_number, $part_number, FT_PEEK);
        if ($structure->encoding == ENCBASE64) {
          return drupal_convert_to_utf8(imap_base64($text), $encoding);
        }
        elseif ($structure->encoding == ENCQUOTEDPRINTABLE) {
          return drupal_convert_to_utf8(quoted_printable_decode($text), $encoding);
        }
        else {
          return drupal_convert_to_utf8($text, $encoding);
        }
      }
      if ($structure->type == TYPEMULTIPART) { /* multipart */
        $prefix = '';
        while (list($index, $sub_structure) = each($structure->parts)) {
          if ($part_number) {
            $prefix = $part_number . '.';
          }
          $data = $this->get_part($stream, $msg_number, $mime_type, $sub_structure, $prefix . ($index + 1), $encoding);
          if ($data) {
            return $data;
          }
        }
      }
    }
    return FALSE;
  }

  /**
   * Returns an array of parts as file objects
   *
   * @param
   * @param $structure
   *   A message structure, usually used to recurse into specific parts
   * @param $max_depth
   *   Maximum Depth to recurse into parts.
   * @param $depth
   *   The current recursion depth.
   * @param $part_number
   *   A message part number to track position in a message during recursion.
   * @return
   *   An array of file objects.
   */
  function get_parts($stream, $msg_number, $max_depth = 10, $depth = 0, $structure = FALSE, $part_number = FALSE) {
    $parts = array();

    // Load Structure.
    if (!$structure && !$structure = imap_fetchstructure($stream, $msg_number)) {
      watchdog('mailhandler', 'Could not fetch structure for message number %msg_number', array('%msg_number' => $msg_number), WATCHDOG_NOTICE);
      return $parts;
    }

    // Recurse into multipart messages.
    if ($structure->type == TYPEMULTIPART) {
      // Restrict recursion depth.
      if ($depth >= $max_depth) {
        watchdog('mailhandler', 'Maximum recursion depths met in mailhander_get_structure_part for message number %msg_number.',   array('%msg_number' => $msg_number), WATCHDOG_NOTICE);
        return $parts;
      }
      $prefix = '';
      foreach ($structure->parts as $index => $sub_structure) {
        // If a part number was passed in and we are a multitype message, prefix the
        // the part number for the recursive call to match the imap4 dot seperated part indexing.
        if ($part_number) {
          $prefix = $part_number . '.';
        }
        $sub_parts = $this->get_parts($stream, $msg_number, $max_depth, $depth + 1,
          $sub_structure, $prefix . ($index + 1));
        $parts = array_merge($parts, $sub_parts);
      }
      return $parts;
    }

    // Per Part Parsing.

    // Initalize file object like part structure.
    $part = new stdClass();
    $part->attributes = array();
    $part->filename = 'unnamed_attachment';
    if (!$part->filemime = $this->get_mime_type($structure)) {
      watchdog('mailhandler', 'Could not fetch mime type for message part. Defaulting to application/octet-stream.', array(), WATCHDOG_NOTICE);
      $part->filemime = 'application/octet-stream';
    }

    if ($structure->ifparameters) {
      foreach ($structure->parameters as $parameter) {
        switch (drupal_strtoupper($parameter->attribute)) {
          case 'NAME':
          case 'FILENAME':
            $part->filename = $parameter->value;
            break;
          default:
            // put every thing else in the attributes array;
            $part->attributes[$parameter->attribute] = $parameter->value;
        }
      }
    }

    // Handle Content-Disposition parameters for non-text types.
    if ($structure->type != TYPETEXT && $structure->ifdparameters) {
      foreach ($structure->dparameters as $parameter) {
        switch (drupal_strtoupper($parameter->attribute)) {
          case 'NAME':
          case 'FILENAME':
            $part->filename = $parameter->value;
            break;
          // put every thing else in the attributes array;
          default:
            $part->attributes[$parameter->attribute] = $parameter->value;
        }
      }
    }

    // Store part id for reference.
    if (!empty($structure->id)) {
      $part->id = $structure->id;
    }

    // Retrieve part and convert MIME encoding to UTF-8
    if (!$part->data = imap_fetchbody($stream, $msg_number, $part_number, FT_PEEK)) {
      watchdog('mailhandler', 'No Data!!', array(), WATCHDOG_ERROR);
      return $parts;
    }

    // Decode as necessary.
    if ($structure->encoding == ENCBASE64) {
      $part->data = imap_base64($part->data);
    }
    elseif ($structure->encoding == ENCQUOTEDPRINTABLE) {
      $part->data = quoted_printable_decode($part->data);
    }
    // Convert text attachment to UTF-8.
    elseif ($structure->type == TYPETEXT) {
      $part->data = imap_utf8($part->data);
    }

    // Always return an array to satisfy array_merge in recursion catch, and
    // array return value.
    $parts[] = $part;
    return $parts;
  }

  /**
   * Retrieve MIME type of the message structure.
   */
  function get_mime_type(&$structure) {
    static $primary_mime_type = array('TEXT', 'MULTIPART', 'MESSAGE', 'APPLICATION', 'AUDIO', 'IMAGE', 'VIDEO', 'OTHER');
    $type_id = (int) $structure->type;
    if (isset($primary_mime_type[$type_id]) && !empty($structure->subtype)) {
      return $primary_mime_type[$type_id] . '/' . $structure->subtype;
    }
    return 'TEXT/PLAIN';
  }

  /**
   * Obtain the number of unread messages for an imap stream
   *
   * @param $result
   *   IMAP stream - as opened by imap_open
   * @param object $mailbox
   *   The mailbox to retrieve from.
   * @return array
   *   IMAP message numbers of unread messages.
   */
  function get_unread_messages($result, $mailbox) {
    $unread_messages = array();
    $number_of_messages = imap_num_msg($result);
    for ($i = 1; $i <= $number_of_messages; $i++) {
      $header = imap_header($result, $i);
      if ($header->Unseen == 'U' || $header->Recent == 'N') {
        $unread_messages[] = $i;
      }
    }
    return $unread_messages;
  }

  /**
   * Retrieve individual messages from an IMAP result.
   *
   * @param $result
   *   IMAP stream.
   * @param object $mailbox
   *   Mailbox to retrieve from.
   * @param int $msg_number
   *   IMAP message number.
   * @param string $filter_name
   *   Mailhandler Filter plugin to use.
   * @return array
   *   Retrieved message, or FALSE if message cannot / should not be retrieved.
   */
  function retrieve_message($result, $mailbox, $msg_number, $filter_name) {
    extract($mailbox->settings);
    $header = imap_headerinfo($result, $msg_number);
    // Check to see if we should retrieve this message at all
    if ($filter = mailhandler_plugin_load_class('mailhandler', $filter_name, 'filters', 'handler')) {
      if (!$filter->fetch($header)) {
        return FALSE;
      }
    }
    // Initialize the subject in case it's missing.
    if (!isset($header->subject)) {
      $header->subject = '';
    }
    $body_text = $this->get_part($result, $msg_number, 'TEXT/PLAIN', FALSE, FALSE, $encoding);
    $body_html = $this->get_part($result, $msg_number, 'TEXT/HTML', FALSE, FALSE, $encoding);
    if (!$body_text && $body_html) {
      $body_text = $body_html;
    }
    elseif ($body_text && !$body_html) {
      $body_html = $body_text;
    }
    // Parse MIME parts, so all mailhandler modules have access to
    // the full array of mime parts without having to process the email.
    $mimeparts = $this->get_parts($result, $msg_number);
    // Is this an empty message with no body and no mimeparts?
    if (!$body_text && !$body_html && !$mimeparts) {
      $message = FALSE;
    }
    else {
      $imap_uid = ($type == 'pop3') ? $this->fetch_uid($mailbox, $msg_number) : imap_uid($result, $msg_number);
      $message = compact('header', 'body_text', 'body_html', 'mimeparts', 'imap_uid');
    }
    return $message;
  }

  /**
   * Close a mailbox.
   */
  function close_mailbox($result) {
    imap_errors();
    imap_close($result, CL_EXPUNGE);
  }

  /**
   * Fetch UID for a message in a POP mailbox.
   *
   * Taken from PHP.net.
   */
  function fetch_uid($mailbox, $msg_number) {
    extract($mailbox->settings);
    $retval = 0;
    $fp = fsockopen($domain, $port);
    if ($fp > 0) {
      $buf = fgets($fp, 1024);
      fwrite($fp, "USER $name\r\n");
      $buf = fgets($fp, 1024);
      fwrite($fp, "PASS $pass\r\n");
      $buf = fgets($fp, 1024);
      fwrite($fp, "UIDL $msg_number\r\n");
      $retval=fgets($fp, 1024);
      fwrite($fp, "QUIT\r\n");
      $buf = fgets($fp, 1024);
      fclose($fp);
    }
    return drupal_substr($retval, 6, 30);
  }
}
