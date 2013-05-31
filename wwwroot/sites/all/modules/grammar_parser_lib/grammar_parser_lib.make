; Drush Make (http://drupal.org/project/drush_make)
api = 2

; Drupal core

core = 7.x
projects[drupal] = 7

; Dependencies

; select the development release or latest "recommended" release
projects[grammar_parser][type] = library
projects[grammar_parser][download][type] = file
;projects[grammar_parser][download][url] = http://ftp.drupal.org/files/projects/grammar_parser-7.x-1.x-dev.tar.gz
projects[grammar_parser][download][url] = http://ftp.drupal.org/files/projects/grammar_parser-7.x-1.2.tar.gz

; enable this for development
;projects[grammar_parser][type] = library
;projects[grammar_parser][download][type] = git
;projects[grammar_parser][download][url] = http://git.drupal.org/project/grammar_parser.git
;projects[grammar_parser][download][branch] = 7.x-1.x
;projects[grammar_parser][download][tag] = 1.2

projects[libraries] = 2
