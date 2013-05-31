<?php
/**
 * @file
 * The code processing mail in the smtp module.
 *
 */

/**
* Modify the drupal mail system to use smtp when sending emails.
* Include the option to choose between plain text or HTML
*/
class SmtpMailSystem implements MailSystemInterface {

  protected $AllowHtml;
  /**
   * Concatenate and wrap the e-mail body for either
   * plain-text or HTML emails.
   *
   * @param $message
   *   A message array, as described in hook_mail_alter().
   *
   * @return
   *   The formatted $message.
   */
  public function format(array $message) {
    $this->AllowHtml = variable_get('smtp_allowhtml', 0);
    // Join the body array into one string.
    $message['body'] = implode("\n\n", $message['body']);
    if ($this->AllowHtml == 0) {
      // Convert any HTML to plain-text.
      $message['body'] = drupal_html_to_text($message['body']);
      // Wrap the mail body for sending.
      $message['body'] = drupal_wrap_mail($message['body']);
    }
    return $message;
  }

  /**
   * Send the e-mail message.
   *
   * @see drupal_mail()
   *
   * @param $message
   *   A message array, as described in hook_mail_alter().
   * @return
   *   TRUE if the mail was successfully accepted, otherwise FALSE.
   */
  public function mail(array $message) {
    $id       = $message['id'];
    $to       = $message['to'];
    $from     = $message['from'];
    $subject  = $message['subject'];
    $body     = $message['body'];
    $headers  = $message['headers'];

    // Create a new PHPMailer object - autoloaded from registry.
    $mailer = new PHPMailer();

    // Turn on debugging, if requested.
    if (variable_get('smtp_debugging', 0) == 1) {
      $mailer->SMTPDebug = TRUE;
    }

    // Set the from name and e-mail address.
    if (variable_get('smtp_fromname', '') != '') {
      $from_name = variable_get('smtp_fromname', '');
    }
    else {
      // If value is not defined in settings, use site_name.
      $from_name = variable_get('site_name', '');
    }

    //Hack to fix reply-to issue.
    $properfrom = variable_get('site_mail', '');
    if (!empty($properfrom)) {
      $headers['From'] = $properfrom;
    }
    if (!isset($headers['Reply-To']) || empty($headers['Reply-To'])) {
      if (strpos($from, '<')) {
        $reply = preg_replace('/>.*/', '', preg_replace('/.*</', '', $from));
      }
      else {
        $reply = $from;
      }
      $headers['Reply-To'] = $reply;
    }

    // Blank value will let the e-mail address appear.

    if ($from == NULL || $from == '') {
      // If from e-mail address is blank, use smtp_from config option.
      if (($from = variable_get('smtp_from', '')) == '') {
        // If smtp_from config option is blank, use site_email.
        if (($from = variable_get('site_email', '')) == '') {
          drupal_set_message(t('There is no submitted from address.'), 'error');
          watchdog('smtp', 'There is no submitted from address.', array(), WATCHDOG_ERROR);
          return FALSE;
        }
      }
    }
    if (preg_match('/^"?.*"?\s*<.*>$/', $from)) {
      // . == Matches any single character except line break characters \r and \n.
      // * == Repeats the previous item zero or more times.
      $from_name = preg_replace('/"?([^("\t\n)]*)"?.*$/', '$1', $from); // It gives: Name
      $from      = preg_replace("/(.*)\<(.*)\>/i", '$2', $from); // It gives: name@domain.tld
    }
    elseif (!valid_email_address($from)) {
      drupal_set_message(t('The submitted from address (@from) is not valid.', array('@from' => $from)), 'error');
      watchdog('smtp', 'The submitted from address (@from) is not valid.', array('@from' => $from), WATCHDOG_ERROR);
      return FALSE;
    }

    // Defines the From value to what we expect.
    $mailer->From     = $from;
    $mailer->FromName = $from_name;
    $mailer->Sender   = $from;


    // Create the list of 'To:' recipients.
    $torecipients = explode(',', $to);
    foreach ($torecipients as $torecipient) {
      if (strpos($torecipient, '<') !== FALSE) {
        $toparts = explode(' <', $torecipient);
        $toname = $toparts[0];
        $toaddr = rtrim($toparts[1], '>');
      }
      else {
        $toname = '';
        $toaddr = $torecipient;
      }
      $mailer->AddAddress($toaddr, $toname);
    }


    // Parse the headers of the message and set the PHPMailer object's settings
    // accordingly.
    foreach ($headers as $key => $value) {
      //watchdog('error', 'Key: ' . $key . ' Value: ' . $value);
      switch (drupal_strtolower($key)) {
        case 'from':
          if ($from == NULL or $from == '') {
            // If a from value was already given, then set based on header.
            // Should be the most common situation since drupal_mail moves the
            // from to headers.
            $from           = $value;
            $mailer->From     = $value;
            // then from can be out of sync with from_name !
            $mailer->FromName = '';
            $mailer->Sender   = $value;
          }
          break;
        case 'content-type':
          // Parse several values on the Content-type header, storing them in an array like
          // key=value -> $vars['key']='value'
          $vars = explode('; ', $value);
          foreach ($vars as $i => $var) {
            if ($cut = strpos($var, '=')) {
              $new_var = drupal_strtolower(drupal_substr($var, $cut + 1));
              $new_key = drupal_substr($var, 0, $cut);
              unset($vars[$i]);
              $vars[$new_key] = $new_var;
            }
          }
          // Set the charset based on the provided value, if there is one.
          $charset = $vars['charset'];
          if ($charset) {
            $mailer->CharSet = $charset;
          }
          switch ($vars[0]) {
            case 'text/plain':
              // The message includes only a plain text part.
              $mailer->IsHTML(FALSE);
              $content_type = 'text/plain';
              break;
            case 'text/html':
              // The message includes only an HTML part.
              $mailer->IsHTML(TRUE);
              $content_type = 'text/html';
              break;
            case 'multipart/related':
              // Get the boundary ID from the Content-Type header.
              $boundary = $this->_get_substring($value, 'boundary', '"', '"');

              // The message includes an HTML part w/inline attachments.
              $mailer->ContentType = $content_type = 'multipart/related; boundary="' . $boundary . '"';
            break;
            case 'multipart/alternative':
              // The message includes both a plain text and an HTML part.
              $mailer->ContentType = $content_type = 'multipart/alternative';

              // Get the boundary ID from the Content-Type header.
              $boundary = $this->_get_substring($value, 'boundary', '"', '"');
            break;
            case 'multipart/mixed':
              // The message includes one or more attachments.
              $mailer->ContentType = $content_type = 'multipart/mixed';

              // Get the boundary ID from the Content-Type header.
              $boundary = $this->_get_substring($value, 'boundary', '"', '"');
            break;
            default:
              // Everything else is unsuppored by PHPMailer.
              drupal_set_message(t('The Content-Type of your message is not supported by PHPMailer and will be sent as text/plain instead.'), 'error');
              watchdog('smtp', 'The Content-Type of your message is not supported by PHPMailer and will be sent as text/plain instead.', array(), WATCHDOG_ERROR);

              // Force the Content-Type to be text/plain.
              $mailer->IsHTML(FALSE);
              $content_type = 'text/plain';
          }
          break;

        case 'reply-to':
          // Only add a "reply-to" if it's not the same as "return-path".
          if ($value != $headers['Return-Path']) {
            if (strpos($value, '<') !== FALSE) {
              $replyToParts = explode('<', $value);
              $replyToName = trim($replyToParts[0]);
              $replyToName = trim($replyToName, '"');
              $replyToAddr = rtrim($replyToParts[1], '>');
              $mailer->AddReplyTo($replyToAddr, $replyToName);
            }
            else {
              $mailer->AddReplyTo($value);
            }
          }
          break;

        case 'content-transfer-encoding':
          $mailer->Encoding = $value;
          break;

        case 'return-path':
        case 'mime-version':
        case 'x-mailer':
          // Let PHPMailer specify these.
          break;

        case 'errors-to':
          $mailer->AddCustomHeader('Errors-To: ' . $value);
          break;

        case 'cc':
          $ccrecipients = explode(',', $value);
          foreach ($ccrecipients as $ccrecipient) {
            if (strpos($ccrecipient, '<') !== FALSE) {
              $ccparts = explode(' <', $ccrecipient);
              $ccname = $ccparts[0];
              $ccaddr = rtrim($ccparts[1], '>');
            }
            else {
              $ccname = '';
              $ccaddr = $ccrecipient;
            }
            $mailer->AddBCC($ccaddr, $ccname);
          }
          break;

        case 'bcc':
          $bccrecipients = explode(',', $value);
          foreach ($bccrecipients as $bccrecipient) {
            if (strpos($bccrecipient, '<') !== FALSE) {
              $bccparts = explode(' <', $bccrecipient);
              $bccname = $bccparts[0];
              $bccaddr = rtrim($bccparts[1], '>');
            }
            else {
              $bccname = '';
              $bccaddr = $bccrecipient;
            }
            $mailer->AddBCC($bccaddr, $bccname);
          }
          break;

        default:
          // The header key is not special - add it as is.
          $mailer->AddCustomHeader($key . ': ' . $value);
      }
    }


  /**
   * TODO
   * Need to figure out the following.

    // Add one last header item, but not if it has already been added.
    $errors_to = FALSE;
    foreach ($mailer->CustomHeader as $custom_header) {
      if ($custom_header[0] = '') {
        $errors_to = TRUE;
      }
    }
    if ($errors_to) {
      $mailer->AddCustomHeader('Errors-To: '. $from);
    }
   */


    // Add the message's subject.
    $mailer->Subject = $subject;


    // Processes the message's body.
    switch ($content_type) {
      case 'multipart/related':
        $mailer->Body = $body;

  /**
   * TODO
   * Firgure out if there is anything more to handling this type.
   */

        break;

      case 'multipart/alternative':
        // Split the body based on the boundary ID.
        $body_parts = $this->_boundary_split($body, $boundary);
        foreach ($body_parts as $body_part) {
          // If plain/text within the body part, add it to $mailer->AltBody.
          if (strpos($body_part, 'text/plain')) {
            // Clean up the text.
            $body_part = trim($this->_remove_headers(trim($body_part)));
            // Include it as part of the mail object.
            $mailer->AltBody = $body_part;
          }
          // If plain/html within the body part, add it to $mailer->Body.
          elseif (strpos($body_part, 'text/html')) {
            // Clean up the text.
            $body_part = trim($this->_remove_headers(trim($body_part)));
            // Include it as part of the mail object.
            $mailer->Body = $body_part;
          }
        }
        break;

      case 'multipart/mixed':
        // Split the body based on the boundary ID.
        $body_parts = $this->_boundary_split($body, $boundary);

        // Determine if there is an HTML part for when adding the plain text part.
        $text_plain = FALSE;
        $text_html  = FALSE;
        foreach ($body_parts as $body_part) {
          if (strpos($body_part, 'text/plain')) {
            $text_plain = TRUE;
          }
          if (strpos($body_part, 'text/html')) {
            $text_html = TRUE;
          }
        }

        foreach ($body_parts as $body_part) {
          // If test/plain within the body part, add it to either
          // $mailer->AltBody or $mailer->Body, depending on whether there is
          // also a text/html part ot not.
          if (strpos($body_part, 'multipart/alternative')) {
            // Clean up the text.
            $body_part = trim($this->_remove_headers(trim($body_part)));
            // Get boundary ID from the Content-Type header.
            $boundary2 = $this->_get_substring($body_part, 'boundary', '"', '"');
            // Split the body based on the boundary ID.
            $body_parts2 = $this->_boundary_split($body_part, $boundary2);

            foreach ($body_parts2 as $body_part2) {
              // If plain/text within the body part, add it to $mailer->AltBody.
              if (strpos($body_part2, 'text/plain')) {
                // Clean up the text.
                $body_part2 = trim($this->_remove_headers(trim($body_part2)));
                // Include it as part of the mail object.
                $mailer->AltBody = $body_part2;
                $mailer->ContentType = 'multipart/mixed';
              }
              // If plain/html within the body part, add it to $mailer->Body.
              elseif (strpos($body_part2, 'text/html')) {
                // Clean up the text.
                $body_part2 = trim($this->_remove_headers(trim($body_part2)));
                // Include it as part of the mail object.
                $mailer->Body = $body_part2;
                $mailer->ContentType = 'multipart/mixed';
              }
            }
          }
          // If text/plain within the body part, add it to $mailer->Body.
          elseif (strpos($body_part, 'text/plain')) {
            // Clean up the text.
            $body_part = trim($this->_remove_headers(trim($body_part)));

            if ($text_html) {
              $mailer->AltBody = $body_part;
              $mailer->IsHTML(TRUE);
              $mailer->ContentType = 'multipart/mixed';
            }
            else {
              $mailer->Body = $body_part;
              $mailer->IsHTML(FALSE);
              $mailer->ContentType = 'multipart/mixed';
            }
          }
          // If text/html within the body part, add it to $mailer->Body.
          elseif (strpos($body_part, 'text/html')) {
            // Clean up the text.
            $body_part = trim($this->_remove_headers(trim($body_part)));
            // Include it as part of the mail object.
            $mailer->Body = $body_part;
            $mailer->IsHTML(TRUE);
            $mailer->ContentType = 'multipart/mixed';
          }
          // Add the attachment.
          elseif (strpos($body_part, 'Content-Disposition: attachment;')) {
            $file_path     = $this->_get_substring($body_part, 'filename=', '"', '"');
            $file_name     = $this->_get_substring($body_part, ' name=', '"', '"');
            $file_encoding = $this->_get_substring($body_part, 'Content-Transfer-Encoding', ' ', "\n");
            $file_type     = $this->_get_substring($body_part, 'Content-Type', ' ', ';');

            if (file_exists($file_path)) {
              if (!$mailer->AddAttachment($file_path, $file_name, $file_encoding, $filetype)) {
                drupal_set_message(t('Attahment could not be found or accessed.'));
              }
            }
            else {
              // Clean up the text.
              $body_part = trim($this->_remove_headers(trim($body_part)));

              if (drupal_strtolower($file_encoding) == 'base64') {
                $attachment = base64_decode($body_part);
              }
              elseif (drupal_strtolower($file_encoding) == 'quoted-printable') {
                $attachment = quoted_printable_decode($body_part);
              }
              else {
                $attachment = $body_part;
              }

              $attachment_new_filename = tempnam(realpath(file_directory_temp()), 'smtp');
              $file_path               = file_save_data($attachment, $attachment_new_filename, FILE_EXISTS_RENAME);

              if (!$mailer->AddAttachment($file_path, $file_name)) { // , $file_encoding, $filetype);
                drupal_set_message(t('Attachment could not be found or accessed.'));
              }
            }
          }
        }
        break;

      default:
        $mailer->Body = $body;
        break;
    }


    // Set the authentication settings.
    $username = variable_get('smtp_username', '');
    $password = variable_get('smtp_password', '');

    // If username and password are given, use SMTP authentication.
    if ($username != '' && $password != '') {
      $mailer->SMTPAuth = TRUE;
      $mailer->Username = $username;
      $mailer->Password = $password;
    }


    // Set the protocol prefix for the smtp host.
    switch (variable_get('smtp_protocol', 'standard')) {
      case 'ssl':
        $mailer->SMTPSecure = 'ssl';
        break;

      case 'tls':
        $mailer->SMTPSecure = 'tls';
        break;

      default:
        $mailer->SMTPSecure = '';
    }


    // Set other connection settings.
    $mailer->Host   = variable_get('smtp_host', '') . ';' . variable_get('smtp_hostbackup', '');
    $mailer->Port   = variable_get('smtp_port', '25');
    $mailer->Mailer = 'smtp';


    // Let the people know what is going on.
    watchdog('smtp', 'Sending mail to: @to', array('@to' => $to));

    // Try to send e-mail. If it fails, set watchdog entry.
    if (!$mailer->Send()) {
      watchdog('smtp', 'Error sending e-mail from @from to @to : !error_message', array('@from' => $from, '@to' => $to, '!error_message' => $mailer->ErrorInfo), WATCHDOG_ERROR);
      return FALSE;
    }

    $mailer->SmtpClose();
    return TRUE;
  }
  /**
   * Splits the input into parts based on the given boundary.
   *
   * Swiped from Mail::MimeDecode, with modifications based on Drupal's coding
   * standards and this bug report: http://pear.php.net/bugs/bug.php?id=6495
   *
   * @param input
   *   A string containing the body text to parse.
   * @param boundary
   *   A string with the boundary string to parse on.
   * @return
   *   An array containing the resulting mime parts
   */
  protected function _boundary_split($input, $boundary) {
    $parts       = array();
    $bs_possible = drupal_substr($boundary, 2, -2);
    $bs_check    = '\"' . $bs_possible . '\"';

    if ($boundary == $bs_check) {
      $boundary = $bs_possible;
    }

    $tmp = explode('--' . $boundary, $input);

    for ($i = 1; $i < count($tmp); $i++) {
      if (trim($tmp[$i])) {
        $parts[] = $tmp[$i];
      }
    }

    return $parts;
  }  //  End of _smtp_boundary_split().



  /**
   * Strips the headers from the body part.
   *
   * @param input
   *   A string containing the body part to strip.
   * @return
   *   A string with the stripped body part.
   */
  protected function _remove_headers($input) {
    $part_array = explode("\n", $input);

    if (strpos($part_array[0], 'Content') !== FALSE) {
      if (strpos($part_array[1], 'Content') !== FALSE) {
        if (strpos($part_array[2], 'Content') !== FALSE) {
            array_shift($part_array);
            array_shift($part_array);
            array_shift($part_array);
        }
        else {
          array_shift($part_array);
          array_shift($part_array);
        }
      }
      else {
        array_shift($part_array);
      }
    }

    $output = implode("\n", $part_array);
    return $output;
  }  //  End of _smtp_remove_headers().



  /**
   * Returns a string that is contained within another string.
   *
   * Returns the string from within $source that is some where after $target
   * and is between $beginning_character and $ending_character.
   *
   * @param $source
   *   A string containing the text to look through.
   * @param $target
   *   A string containing the text in $source to start looking from.
   * @param $beginning_character
   *   A string containing the character just before the sought after text.
   * @param $ending_character
   *   A string containing the character just after the sought after text.
   * @return
   *   A string with the text found between the $beginning_character and the
   *   $ending_character.
   */
  protected function _get_substring($source, $target, $beginning_character, $ending_character) {
    $search_start     = strpos($source, $target) + 1;
    $first_character  = strpos($source, $beginning_character, $search_start) + 1;
    $second_character = strpos($source, $ending_character, $first_character) + 1;
    $substring        = drupal_substr($source, $first_character, $second_character - $first_character);
    $string_length    = drupal_strlen($substring) - 1;

    if ($substring[$string_length] == $ending_character) {
      $substring = drupal_substr($substring, 0, $string_length);
    }

    return $substring;
  }  //  End of _smtp_get_substring().
}
