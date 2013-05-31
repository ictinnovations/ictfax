<?php
/**
 * @file
 * MailhandlerFiltersComments class.
 */

class MailhandlerFiltersComments extends MailhandlerFilters {
  /**
   * Whether or not to fetch message, based on headers.
   *
   * @param $header
   *   Message headers
   * @return
   *   TRUE if comment, FALSE otherwise
   */
  function fetch($header) {
    return isset($header->in_reply_to);
  }
}
