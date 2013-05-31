
SMTP Authentication Support module for Drupal 7.x.
This module adds SMTP functionality to Drupal.

REQUIREMENTS
------------
* Access to an SMTP server
* The following PHP extensions need to be installed: ereg, hash, date & pcre.

* Optional: To connect to an SMTP server using SSL, you need to have the
  openssl package installed on your server, and your webserver and PHP
  installation need to have additional components installed and configured.

INSTALLATION INSTRUCTIONS
-------------------------
1.  Copy the files included in the tarball into a directory named "smtp" in
    your Drupal sites/all/modules/ directory.
2.  Login as site administrator.
3.  Enable the SMTP Authentication Support module on the Administer -> Site
    building -> Modules page.
4.  Fill in required settings on the Administer -> Site configuration -> SMTP
    Authentication Support page.
5.  Enjoy.

NOTES
-----
This module sends email by connecting to an SMTP server.  Therefore, you need
to have access to an SMTP server for this module to work.

Drupal will often use the email address entered into Administrator -> Site
configuration -> E-mail address as the from address.  It is important for
this to be the correct address and some ISPs will block email that comes from
an invalid address.

This module no longer uses the PHPMailer package as an external library, instead
a slimmed down version of the library have been relicensed and integrated with the
smtp module.

Connecting to an SMTP server using SSL is possible only if PHP's openssl
extension is working.  If the SMTP module detects openssl is available it
will display the options in the modules settings page.

Sending mail to Gmail requires SSL or TLS.
