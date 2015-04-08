Update Instructions
===================
First of all note your current version of ICTFAX and ICTCore, you may need these information to select appropriate update script for your installation.

1: Update ICTCore
=================
1. As being super user (root) issue following command at shell
```bash
yum install ictcore ictcore-freeswitch ictcore-sendmail ictcore-email ictcore-fax
```
2. Download latest version of ictfax from githup
3. Update ictfax / ictcore mysql database while using appropriate update.sql file from update folder (ICTFAX source code)
```bash
mysql ictfax
```
and then at mysql prompt
```bash
source /path/to/ictfax/update/update.sql;
```

2: Update ICTFAX Modules
========================
Replace ictpbx folder in ictfax/sites/all/modules with the latest one

