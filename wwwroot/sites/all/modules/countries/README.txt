Countries module - http://drupal.org/project/countries
======================================================

DESCRIPTION
------------
This module provides four country related tasks.

 * A countries database with an administrative interface.
 * A way to alter Drupals core country list.
 * A country FAPI element.
 * A countries field.

REQUIREMENTS
------------
Drupal 7.x

INSTALLATION
------------
1.  To install the module copy the 'countries' folder to your 
    sites/all/modules directory.

2.  Go to admin/build/modules. Enable the module.
    It is found in the Others section.

Read more about installing modules at http://drupal.org/node/70151

UPGRADING
---------
Any updates should be automatic. Just remember to run update.php!

## Prerelease upgrades ##

If you have installed the CVS version prior to 2009-10-11, you will need to
manually change the database column {countries_country}.printable_name to
{countries_country}.official_name. No releases require this change.

FEATURES
--------

1 - Countries database

This is a simple table based on the ISO 3166-1 alpha-2 codes [1]. It covers the
countries standard name, official name, ISO 3166-1 alpha-3 code, UN numeric code
(ISO 3166-1 numeric-3) and continent (Africa, Antarctica, Asia, Europe, North
America, Oceania, South America). An enabled flag defines a countries status.

For example, Taiwan has the following values:

 * Name           - Taiwan
 * Offical name   - Taiwan, Republic of China
 * ISO alpha-2    - TW
 * ISO alpha-3    - TWN
 * ISO numeric-3  - 158
 * Continent      - Asia
 * Enabled        - Yes

The official names were taken from WikiPedia [2] and the majority of the
continent information was imported from Country codes API project [3].

Please report any omissions / errors.

I have no plans to create a "Countries bundle", which would allow users to
extend this table using the Fields API. I am willing to give someone CVS access
to either create a sub-project within this module to do this or if done via
another project, access to make requires changes within the Countries module to
accomplish this task. And to anyone else that just wants to help!

2 - Alter Drupals core country list

The module implement hook_countries_alter() which updates any list generated
using country_get_list() to filter out any disabled countries and adds the
potential to rename these based on your personal or political preferences.

## Developers note: ##

There is no need to make this module a dependency unless you use the FAPI or
Field elements. A simple countries list should be generated using:

--------------------------------------------------------------------------------
<?php
  include_once DRUPAL_ROOT . '/includes/locale.inc';
  $countries = country_get_list();
?>
--------------------------------------------------------------------------------

To bypass any third party interaction via hook_countries_alter(), use:

--------------------------------------------------------------------------------
<php
  include_once DRUPAL_ROOT . '/includes/iso.inc';
  $countries = _country_get_predefined_list();
?>
--------------------------------------------------------------------------------

3 - A country FAPI element

After programming yet another select list with a country drop down, I
encapsulated the logic into a simple FAPI element. By default it uses
country_get_list(), so filters based on the countries status.

The simplest usage for a single select country drop down list is:

--------------------------------------------------------------------------------
<?php
  $element = array(
    '#type' => 'country',
    '#default_value' => 'AU',
  );

  // a better example for the default value would be:
  $default_country = variable_get('site_default_country', '');
  $element = array(
    '#type' => 'country',
    '#default_value' => isset($edit['iso2']) ? $edit['iso2'] : $default_country,
  );
?>
--------------------------------------------------------------------------------

Custom filters are available to bypass the default country_get_list(), to filter
based on status and continent.

--------------------------------------------------------------------------------
<?php
  $element = array(
    '#type' => 'country',
    '#default_value' => 'AU',
    '#multiple' => TRUE, // multiple select
    '#cardinality' => 4, // max. selection allowed is 4 values
    '#filters' => array(
      // enabled options should be one of these constants:
      // COUNTRIES_ALL, COUNTRIES_ENABLED, or COUNTRIES_DISABLED
      'enabled' => COUNTRIES_ENABLED,
      // The restrict by continent filter accepts an array of continent codes.
      // The default continents that are defined are [code - name]:
      // AF - Africa, AN - Antarctica, AS - Asia, EU - Europe,
      // NA - North America, OC - Oceania, SA - South America, UN - Unknown
      'continents' => array('EU', 'OC'),
    ),
  );
?>
--------------------------------------------------------------------------------

4 - A country field

Provides a standard field called "Country", with a widget "Country select list".
The default display options are:

Default (The country name)
Official name
ISO alpha-2 code
ISO alpha-3 code
ISO numeric-3 code

HOWTO / FAQ
-----------

1 - Revert the database to the original values.

Currently this is not possible. You would have to uninstall and install the
module. Any customizations, (and maybe fields), would need to be recreated and
populated

2 - Change the continent list.

These are generated using a variable_get() like this:

--------------------------------------------------------------------------------
<?php
  $continents = variable_get('countries_continents',
      countries_get_default_continents());
?>
--------------------------------------------------------------------------------

To update these, you need to set the system variable 'countries_continents'. The
easiest way to do this is to cut and paste the following into your themes 
template.php, changing the array values to suit your requirements. Load one page
on your site that uses the theme, then delete the code.

--------------------------------------------------------------------------------
<?php
  variable_set('countries_continents', array(
    'AF' => t('Africa'),
    'EA' => t('Asia & Europe'),
    'AM' => t('America'),
    'OC' => t('Oceania'),
    'AN' => t('Antarctica'),
    'UN' => t('Unknown'),
  ));
?>
--------------------------------------------------------------------------------

Any invalid continent keys that are found are converted to t('Unknown'), so
update all respective countries before deleting any existing values. Currently
there is no front-end presentation of the continent information.

3 - Hiding columns in the administrative country overview page.

Like the continents, these are dynamically generated from the system variables.
They can also be changed in a similar variable_set, like 'countries_continents'.

The name, ISO alpha-2 and enabled columns can not be removed.

--------------------------------------------------------------------------------
<?php
  // Remove the columns that you want to hide.
  variable_set('countries_admin_overview_columns', array(
    'iso3' => t('ISO3'),
    'numcode' => t('Number code'),
    'continent' => t('Continent'),
    'official_name' => t('Official name'),
  ));
?>
--------------------------------------------------------------------------------

4 - I18n support?

2009-10-11
  This is planned, but the i18n project is not even started to be ported yet.


5 - Why is the delete link hidden on some countries? Why is the edit ISO alpha-2
code disabled on some countries?

These are the countries that Drupal defines. To disable a country in the list of
countries that Drupal generates, these must be present in the database. Also
done to ensure that existing references to these countries still exist, even if
you can no longer select them when they are disabled.

6 - How does this differ from countries_api?

The countries_api is a just that, an API locked into a back-end country and
regions database that has no configurable options. It main purpose is converting
country code data from one format to another. 

From the Country codes API modules project page:

    "Typical usage would be converting a country name to its ISO2
    (or ISO3) country code."

The Countries module is based on the philosophy that only the ISO2 code can be
trusted. All other data can be modified by the sites administrator, and the ISO2
is the primary key. Then the most common country requirements are built on top
of this base, providing the input elements, etc. 

7 - Related modules

Most other related modules involve external geo-data lookups / regional data
integration.

A quick search on drupalmodules.com provided the following list

 * addresses - http://drupal.org/project/addresses
   A comprehensive module that is covers countries, regions, zip codes, postal
   formats, ...
   
 * zipcode (CCK) - http://drupal.org/project/zipcode
   Hardcode validation of the Zip codes for 8 countries.

 * GeoNames - http://drupal.org/project/geonames
   XML-based Services from GeoNames.

 * Profile Location - http://drupal.org/project/profile_location
   Region / Country profile field.

 * IP to Country - http://drupal.org/project/ip2cc
   IP to Country lookup.

 * IP-based Determination of a Visitor's Country
      - http://drupal.org/project/ip2country
   IP to Country lookup.

 * IP2Nation API - http://drupal.org/project/ip2nation
   IP to Country lookup.

 * Hostip - http://drupal.org/project/hostip
   IP to Country lookup.
    
 * GeoUser - http://drupal.org/project/geouser
   IP to Country lookup.
    
 * GeoIP API - http://drupal.org/project/geoip
   API for external database.
    
 * Country codes API - http://drupal.org/project/countries_api
   API for mapping country / region data.
    
 * Ad GeoIP - http://drupal.org/project/ad_geoip
   Adds geotargeting functionality to the Drupal advertisement module.
    
 * SIN - CCK - http://drupal.org/project/sin
   Country Social Insurance Numbers CCK field.
    
 * Country code - http://drupal.org/project/country_code
   Location content handling based on the user's IP address.
    
 * Site Country - http://drupal.org/project/site_country
   Enables site default country. (Now in core)

 * GeoSniper - http://drupal.org/project/geosniper
   User information in a block.

                  Drupal ver.  Features
                  5.x 6.x 7.x  DB IP2C IPO Flags CCK Other / Notes
ad_geoip           y   y       y   y                 ad module extension
addresses                      y                  y  Multiple fields
country_code           y       c                     Site switching
countries_api      y   y       y                     Data mapping
geoip              y   y       c   y
geonames           y   y       y   y   y
geosniper              y               y             Info block
geouser                y       c   y                 Stored against user
hostip             y               y
ip2cc              y   y           y
ip2nation          y   y       y   y   y    y
ip2country         y   y           y
profile_location   y   y       y                  -  Profile region / country
sin                y   y                          y  Social Insurance Numbers
site_country           y  core c                     Default country 
zipcode                y       c*                 y  Zipcodes
    
Key
---
DB - Country database: y - db, c - code, c* - limited code info 
IP2C - IP to Country lookup
IPO - IP to xxx. Gets geodata about the users location
Flags - Country flags
CCK - Provides CCK or Fields


AUTHOR
------
Alan D. - http://drupal.org/user/198838.

REFERENCES
----------
[1] http://www.iso.org/iso/country_codes/iso_3166_code_lists.htm
[2] http://en.wikipedia.org/wiki/List_of_countries
[3] http://drupal.org/project/countries_api
