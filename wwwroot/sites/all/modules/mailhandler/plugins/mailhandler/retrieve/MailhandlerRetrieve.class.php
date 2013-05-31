<?php
/**
 * @file
 * Definition of MailhandlerRetrieve class.
 */

/**
 * Retrieve messages from a Mailhandler Mailbox.
 */
abstract class MailhandlerRetrieve {

  /**
   * Connect to mailbox and run message retrieval.
   *
   * @param $mailbox
   *   Array of mailbox configuration.
   * @param $limit
   *   Int - the maximim number of messages to fetch on retrieval, only for
   *   'auto' mode.
   * @param $encoding
   *   Text encoding of messages.
   * @param $filter_name
   *   Mailhandler filter to restrict what messages are retrieved.
   */
  public function retrieve($mailbox, $limit = 0, $encoding = 'UTF-8', $filter_name = 'MailhandlerFilters') {
    return;
  }

  /**
   * Test connection.
   */
  public function test($mailbox) {
    return array();
  }

  public function purge_message($mailbox, $message) {
    return;
  }
}
