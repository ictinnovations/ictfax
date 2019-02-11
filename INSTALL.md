### ICTFAX - INSTALLATION GUIDE (CENTOS / FEDORA)

For older version view [Installation Guide for ICTFax 3.7][installation_guide_old]

**INSTALLATION INSTRUCTIONS**   

ICTFax is a unique and complete solution featuring Mass faxing. Email to Fax, Web to Fax, Fax to Email and Fax over IP server with ATA / Rest API support

### 1. INSTALL BASIC SYSTEM REQUIREMENTS

* CentOs 7
* Apache 2
* MySQL 5
* PHP 5.3.3
* ICTCore
* Sendmail
* FreeSWITCH

To install above requirements, first of all we need to install their respective repositories
Note: this guide is specifically written for CentOs 7

    yum install -y https://service.ictinnovations.com/repo/7/ict-release-7-4.el7.centos.noarch.rpm
    yum install -y http://files.freeswitch.org/freeswitch-release-1-6.noarch.rpm
    yum install -y epel-release 

Disable SELinux, before proceeding further,
Check the SELinux state by:

    getenforce 

and then disable with  
         
    setenforce 0

If the output is either permissive or disabled, skip this task and follow the instructions given below, otherwise disable it first and then follow the instructions:

### 2. ICTCORE INSTALLATION
ICTCore is main dependency of ICTFax, if you have proper repositories pre installed (see above) then all other dependencies will be installed along with ICTCore. We just need to issue following command:

    yum -y install ictcore ictcore-fax ictcore-email

**SETUP ICTFax DATABASE**

Login to mysql and enter these commands one by one:
 
    CREATE DATABASE ictfax;
    USE ictfax;
    GRANT ALL PRIVILEGES ON ictfax.* TO ictfaxuser@localhost IDENTIFIED BY 'plsChangeIt';
    FLUSH PRIVILEGES;
    SOURCE /usr/ictcore/db/database.sql;
    SOURCE /usr/ictcore/db/fax.sql;
    SOURCE /usr/ictcore/db/email.sql;
    SOURCE /usr/ictcore/db/data/role_user.sql;
    SOURCE /usr/ictcore/db/data/role_admin.sql;
    SOURCE /usr/ictcore/db/data/demo_users.sql;
  
Now update `/usr/ictcore/etc/ictcore.conf` files with database credential as per above created database.

Open the file ictcore.conf and find out the [db] section and replace user, password and database name in the following lines:

    user = ictfaxuser
    pass = plsChangeIt
    name = ictfax

### 3. ICTFax INSTALATION 

Now install ICTFax web interface

    yum install ictfax

Now Restart the **apache** by typing the following command in the terminal

    service httpd restart

Now visit `http://yourdomain/ictfax` in your browser 

Default Username : **admin@ictcore.org**  
Default Password : **helloAdmin**  

Login by entering the default admin and password, which we provided you. Go to the administration panel, which is placed on the bottom of the side bar on left.Create a new user or edit the existing.

You can configure providers and accounts too. For further details visit **[Admin guide][admin_guide]**.

### Useful links
* [Starting with REST APIs for FAX][api_tutorial]
* [Complete REST API Guide for ICTFax][api_guide]

[installation_guide_old]: http://ictfax.org/installation-guide-ictfax-3.7 "ICTFax installation guide for version 3.7"
[admin_guide]: http://ictfax.org/content/ictfax-admin-guide "ICTFAX Administration Guide"
[api_tutorial]: http://ictfax.org/fax-api-tutorial "ICTFax REST API Tutorial"
[api_guide]: http://ictfax.org/fax-rest-api-guide.html "ICTFax REST API Guide for faxing"
