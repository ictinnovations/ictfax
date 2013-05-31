
CONTENTS OF THIS FILE
---------------------

 * Author
 * Description
 * Installation

AUTHOR
------
Jim Berry ("solotandem", http://drupal.org/user/240748)

DESCRIPTION
-----------
This module provides a library interface to the Grammar Parser library module
available at http://drupal.org/project/grammar_parser. This interface enables
automatic loading of the classes defined in the code. The Drush Make file
included with this project will install this code library for use with the
Libraries API.

INSTALLATION
------------
To use this module, install it in a modules directory. See
http://drupal.org/node/895232 for further information.

The included Drush Make file provides a convenient method of downloading and
installing the correct versions of the Libraries API (>=2) and the Grammar
Parser (>=1.2) dependencies. From a command line, simply invoke:

  drush make gplib.make

The "libraries" version string should be ">=2" in the .info file included with
this project. However until there is a "recommended" release on the 2.x branch
the version requirement can not be specified. This is a core bug.
