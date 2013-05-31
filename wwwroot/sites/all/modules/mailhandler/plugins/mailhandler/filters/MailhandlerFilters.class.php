<?php
/**
 * @file
 * Definition of MailhandlerFilters class.
 */

/**
 * Defines message filters for the Mailhandler Fetcher.
 *
 * These filters allow the fetcher to discriminate between different types of
 * messages (nodes or comments).
 */
class MailhandlerFilters {
  /**
   * Whether or not to fetch message, based on headers.
   *
   * @param $header
   *   Message headers
   * @return
   *   Always TRUE
   */
  public function fetch($header) {
    return TRUE;
  }
}
