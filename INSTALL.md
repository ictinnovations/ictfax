Installation Instructions
=========================


1: Introduction
===============

ICT-FAX is a unique and complete faxing solution featuring T.38 support, Email2Fax, Web2Fax,
Fax2Email and Billing.


2: Install Basic System Requirements
====================================

 1.  CentOs 6
 2.  Apache 2
 3.  MySQL 5
 4.  PHP 5.3.3
 5.  ICTCore
 6.  Sendmail
 7.  FreeSWITCH

To install above requirements, first of all we need to install their respective repositories

```bash
rpm -Uvh 'http://service.ictinnovations.com/repo/6/ict-release-6-2.noarch.rpm'
rpm -Uvh 'http://download.fedoraproject.org/pub/epel/6/i386/epel-release-6-8.noarch.rpm'
rpm -Uvh 'http://files.freeswitch.org/freeswitch-release-1-0.noarch.rpm'
```

Before proceeding further please disable selinux and to disable it permanently edit /etc/selinux/config file

```bash
setenforce 0
```

3: ICTCore Installation
=======================
ICTCore is main dependency of ICTFAX, if you have proper repositories pre installed (see above) then all other dependencies will be installed along with ICTCore. so we just need to issue following command

```bash
yum -y install ictcore ictcore-voice ictcore-fax ictcore-email
```

### 3.1 Setup ICTCore database
To create database in mysql for ictcore issue following commands at mysql prompt

```bash
CREATE DATABASE ictfax;
USE ictfax;
GRANT ALL PRIVILEGES ON ictfax.* TO ictfaxuser@localhost IDENTIFIED BY 'plsChangeIt';
FLUSH PRIVILEGES;

SOURCE /usr/ictcore/db/database.sql;
SOURCE /usr/ictcore/db/email.sql;
SOURCE /usr/ictcore/db/fax.sql;
```

Now update /usr/ictcore/etc/ictcore.conf and /usr/ictcore/etc/odbc.ini files as per above created database


4: ICTFax Installation
======================
1. (if any) delete /usr/ictfax
2. Download, ictfax folders into temp folder
3. move ICTFAX wwwroot folder into /usr/ictfax
4. move ictpbx folder into /usr/ictfax/sites/all/modules
5. issue following command to create website configuration file
```bash
cp /usr/ictfax/sites/default/default.settings.php /usr/ictfax/sites/default/settings.php
chown -R apache:apache /usr/ictfax
```
6. Update Apache configurations to set /usr/ictfax as DocumentRoot
7. restart Apache

### 4.1 Frontend / Web GUI
1. Now visit http://DOMAIN.COM/ and follow the installation instructions for ICTFax (drupal based) front end installation.
2. When asked for database please provide access info to recently created database ( in ictcore section ) and enter `web_` as table prefix
2. Once you are done with installation, visit the website and login as site administrator with username and password that you provided during installation.
4. Now comeback to Web GUI and go to Modules menu and enable all modules in __ICTCore System__ Package.
5. And also enable __Chaos tools__ Package.
6. Now you'll see menu item Fax Account, ICTPBX System and others in your Navigation Menu.
7. After all please make sure that "Authenticated User" has permission over "Can use ICTFAX" from module permissions

### 4.2 User Synchronization
After installation issue following command against ictfax database, to synchronize ICTFAX users with ICTCore

```sql
INSERT INTO usr SELECT NULL, NULL, name, pass, NULL, NULL, NULL, NULL, NULL, mail, NULL, NULL, NULL, NULL, NULL, 1, UNIX_TIMESTAMP(), 1, NULL, NULL FROM web_users WHERE uid > 0;
```

5: Email to FAX / FAX to Email service (optional)
=================================================
1. make sure that your desired domain's MX records are properly configured for email2fax server.
2. enable sendmail to listen on public ip address look for following line in /etc/mail/sendmail.mc
```conf
DAEMON_OPTIONS(`Port=smtp,Addr=127.0.0.1, Name=MTA')dnl
```
3. and change line mentioned above into
```conf
DAEMON_OPTIONS(`Port=smtp, Addr=0.0.0.0, Name=MTA')dnl
```
4. Add ictcore and apache to list of trusted user 
```bash
echo "ictcore" >> /etc/mail/trusted-users
echo "apache" >> /etc/mail/trusted-users
```
5. Add your domain name in allowed local domain list to let sendmail receive mails for that domain
```bash
echo "FAX_DOMAIN.COM" >> /etc/mail/local-host-names
```
6. route all mails for none-existing addresses into ictcore mailbox so we can receive emails for addresses like `xyz_number@FAX_DOMAIN.COM`
```bash
echo '@FAX_DOMAIN.COM ictcore' >> /etc/mail/virtusertable
```
7. to apply email related changes
```
/etc/mail/make
```
8. restart sendmail service so changes can take affect
```bash
chkconfig sendmail on
service sendmail restart
```
9. edit /usr/ictcore/etc/ictcore.conf and update __mailbox__ section like following
```ini
folder = /var/spool/email/ictcore
```

NOTE: make sure that `/etc/hosts.allow` is properly configured for accepting mails, and smtp `port (25)` is not blocked by firewall. if so execute following line to allow smtp port in firewall: 

```bash
/sbin/iptables -I INPUT -p tcp -m state --state NEW -m tcp --dport 25 -j ACCEPT    # smtp
/etc/init.d/iptables save
```
  
Now you are ready to send faxes through your email. See Admin/User Guide for further details.


6: First FAX
============

### 6.1: Sending First FAX
1. Login as admin
2. Add gateway / trunk for outgoing fax at "ICTCore System" => "Provider Trunks"
3. Currently, in ICTFAX3.0 only one gateway/trunk will be used for calling. Currently routing is not supported.
4. Register (Sign up) a new user by registering from http://DOMAIN.COM/ictfax/?q=user/register. Directly adding user from admin=>people is not supported. Once user is registered, it is blocked by default. Login in as admin and Activate it from admin=>People. (Sign up process can be changed from admin => configuration => Account settings. 
5. Logout
6. Login as newly created user
7. Send new fax via "FAX Account" => "Fax Outbox" => ""Create New FAX"
or via email2fax
8. From user registration email address send an email with following values

* To: faxnumber@FAX_DOMAIN.COM
* Subject: Anything
* Body:
* Attachment: pdf file

NOTE: Attach only a single file. Every time create new email message and give unique email subject. 
Using Forward or Reply may confuse ictfax system with some previous email subjects.

### 6.2: Receiving First FAX
1. Point DIDs to fax server
2. Configure freeswitch to receive traffic for this DID provider. 
3. Usually only IP address of the DID provider is sufficient to be added in ACL.
4. In Web GUI login as admin
5. Add incoming did number at "ICTPBX System" => "DID Numbers" 
6. Assign a DID number to previously created VoIP Account from "ICTPBX System" => "Assign/Release"
7. Logout
8. Login as previously created user
9. Click on "Settings" => "My Incoming Numbers"
10. Forward fax by selecting "Forward" and enter some email address in given box and save
11. Send test fax to selected did

7: Extra
========
Optionally for text to fax support you can install

```bash
yum -y install git make 
```

also install yudit for text to pdf support

```bash
cd /usr/src
wget "http://www.yudit.org/download/yudit-2.9.2.tar.gz"
tar xzf yudit-2.9.2.tar.gz
cd yudit*
./configure --prefix=/usr/local
make
make install
```

8: Contacts
===========
info@ictinnovations.com
http://www.ictinnovations.com
