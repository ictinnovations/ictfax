<?php
/**
 * @file
 * MailhandlerFiltersNodes class.
 */

class MailhandlerFiltersNodes extends MailhandlerFilters {
  /**
   * Whether or not to fetch message, based on headers.
   *
   * @param $header
   *   Message headers
   * @return
   *   TRUE if node, FALSE otherwise
   */
  function fetch($header) {
    return !isset($header->in_reply_to);
  }
}
