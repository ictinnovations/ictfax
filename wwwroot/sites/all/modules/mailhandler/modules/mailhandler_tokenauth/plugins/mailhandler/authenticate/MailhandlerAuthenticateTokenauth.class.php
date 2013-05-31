<?php
/**
 * @file
 * MailhandlerAuthenticateTokenauth class.
 */

/**
 * Authenticate message based on token from tokenauth module.
 *
 * If the user's token is found somewhere in the "to" field, assign that user's
 * uid and name to the node object. A rough search for the token somewhere in
 * the "toaddress" is performed instead of an exact, ordered match in order to
 * allow some freedom in the format of allowed "toaddress". For example, if
 * using a catchall email address, the toaddress could be:
 *
 * f93ksj35dx@example.com - where f93ksj35dx is the user's token or
 * alternatively:
 * f93ksj35dx-foo@example.com - where f93ksj35dx is the user's token and foo is
 * the name of an Organic Group to which the message should be assigned.
 *
 * A rough search allows for different approaches to use this single
 * authentication method.
 */
class MailhandlerAuthenticateTokenauth extends MailhandlerAuthenticate {

  public function authenticate(&$message, $mailbox) {
    list($fromaddress, $fromname) = _mailhandler_get_fromaddress($message['header'], $mailbox);
    $uid = 0;
    // If user with given email address exists and their token is in the toaddress, allow.
    if (($from_user = array_shift(user_load_multiple(array(), array('mail' => $fromaddress)))) && strpos($header->to[0]->mailbox, tokenauth_get_token($from_user->uid)) !== FALSE) {
      $uid = $from_user->uid;
    }
    return $uid;
  }
}
