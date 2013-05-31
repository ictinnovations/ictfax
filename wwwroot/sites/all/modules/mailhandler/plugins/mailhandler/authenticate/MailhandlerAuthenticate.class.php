<?php
/**
 * @file
 * MailhandlerAuthenticate class.
 */

abstract class MailhandlerAuthenticate {

  /**
   * Authenticates an incoming message.
   *
   * @param $item
   *   Array containing message headers, body, and mailbox information.
   */
  public function authenticate(&$message, $mailbox) {
    list($fromaddress, $fromname) = _mailhandler_get_fromaddress($message['header'], $mailbox);
    $uid = 0;
    return $uid;
  }

}
