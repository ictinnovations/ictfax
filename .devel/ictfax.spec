%define ictfax_version __ICTFAX_VERSION__
%define ictfax_edition __ICTFAX_EDITION__
%define ictfax_build   __ICTFAX_BUILD__
%define ictfax_home    %{_prefix}/ictfax

Name:    ictfax
Version: %{ictfax_version}.%{ictfax_build}
Release: %{ictfax_edition}%{?dist}
Summary: Fax server with Email to Fax, Fax to Email and Web interface for fax

Vendor:   ICT Innovations
Group:    ict
Packager: Nasir Iqbal <nasir@ictinnovations.com> 
License:  GPLv3
URL:      http://www.ictinnovations.com/ictfax

Source0:  %{name}-%{version}.tar.gz

BuildArch: noarch
BuildRoot: %{_tmppath}/%{name}-%{version}-%{release}-root-%(%{__id_u} -n)
BuildRequires: git

Provides: ictfax

# ICTFax developed in php
Requires: drupal7 drush
Requires: ictcore ictcore-voice ictcore-fax ictcore-email

# ICTFax use mysql as database in centos 6 or mariadb in centos 7
%if %{rhel} > 6
Requires: mariadb mariadb-server
%else
Requires: mysql mysql-server
%endif
# ICTFax exposse its services via apache web server
Requires: httpd
# Other dependencies
Requires: coreutils cronie dos2unix


%description
ICTFax is an application for fax and fax to email related services, it provide web interface to interact for fax users

%prep
%setup -q -n %{name}-%{version}

%build


%install
%{__rm} -rf %{buildroot}
%{__install} -d %{buildroot}%{ictfax_home}
%{__cp} -pr * %{buildroot}%{ictfax_home}

# make ictfax drupal related modules available for site
%{__mkdir} -p %{buildroot}/etc/drupal7/all/modules
%{__ln_s} /usr/ictfax/ictpbx %{buildroot}/etc/drupal7/all/modules/ictpbx
%{__mkdir} -p %{buildroot}/etc/drupal7/all/themes
%{__ln_s} /usr/ictfax/drupal/themes/touch %{buildroot}/etc/drupal7/all/themes/touch
%{__mkdir} -p %{buildroot}/etc/drupal7/all/profiles
%{__ln_s} /usr/ictfax/drupal/profiles/fax_server %{buildroot}/etc/drupal7/all/profiles/fax_server

%clean
%{__rm} -rf %{buildroot}


%files
# basic configuration files
%defattr(644,root,root,755)
/etc/drupal7/all/modules/ictpbx
/etc/drupal7/all/themes/touch
/etc/drupal7/all/profiles/fax_server

# include all ictfax files and folder
%defattr(644,root,root,755)
%{ictfax_home}

# save documents
%doc %{ictfax_home}/CHANGLOG.md
%doc %{ictfax_home}/README.md
%doc %{ictfax_home}/INSTALL.md
%doc %{ictfax_home}/LICENSE.md
%doc %{ictfax_home}/UPDATE.md
%doc %{ictfax_home}/TODO.md

%post
# enable and start cron service
/sbin/chkconfig crond on
/sbin/service crond restart
# enable and start mysql or mariadb server
%if %{rhel} > 6
/bin/systemctl enable mariadb.service
/bin/systemctl start mariadb.service
%else
/sbin/chkconfig mysqld on
/sbin/service mysqld start
%endif
# enable and start apache server
/sbin/chkconfig httpd on
/sbin/service httpd restart
%if %{rhel} > 6
/sbin/iptables -I INPUT -p tcp -m state --state NEW -m tcp --dport 80 -j ACCEPT    # web
/sbin/iptables -I INPUT -p tcp -m state --state NEW -m tcp --dport 443 -j ACCEPT   # ssl web
/etc/init.d/iptables save
%else
/bin/firewall-cmd --zone=public --add-port=80/tcp --permanent    # web
/bin/firewall-cmd --zone=public --add-port=443/tcp --permanent   # ssl web
/bin/firewall-cmd --reload
%endif

%changelog
* Sat Jun 24 2017 Nasir Iqbal <nasir@ictinnovations.com> - 3.7.5
- First RPM release
