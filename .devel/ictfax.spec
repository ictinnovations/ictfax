%define ictfax_version __ICTFAX_VERSION__
%define ictfax_edition __ICTFAX_EDITION__
%define ictfax_build   __ICTFAX_BUILD__
%define ictfax_home    %{_prefix}/ictfax

Name:    ictfax
Version: %{ictfax_version}.%{ictfax_build}
Release: %{ictfax_edition}%{?dist}
Summary: Web based management interface for ICTFax

Vendor:   ICT Innovations
Group:    ict
Packager: Nasir Iqbal <nasir@ictinnovations.com> 
License:  MPLv2
URL:      https://ictfax.org/

Source0:  %{name}-%{version}.tar.gz
Source1:  ictfax.conf

BuildArch: noarch
BuildRoot: %{_tmppath}/%{name}-%{version}-%{release}-root-%(%{__id_u} -n)
BuildRequires: npm git

Provides: ictfax

# GUI dependence on ICTCore
Requires: ictcore-voice ictcore-fax ictcore-email ictcore-sms
# ICTCore GUI exposse its interface via apache web server
Requires: httpd

%description
ICTCore GUI is web based interface which act as client to ICTCore REST APIs and expose Voice, Fax, SMS and Email related services over web

%prep
%setup -q -n %{name}-%{version}

%build
npm install
./node_modules/.bin/ng build --prod

%install
%{__rm} -rf %{buildroot}
%{__install} -d %{buildroot}%{ictfax_home}
%{__cp} -pr dist/* %{buildroot}%{ictfax_home}
# install ictfax configuration for apache
%{__mkdir} -p %{buildroot}/etc/httpd/conf.d/
%{__cp} %SOURCE1 %{buildroot}/etc/httpd/conf.d/ictfax.conf

%clean
%{__rm} -rf %{buildroot}

%files
# basic configuration files
%defattr(644,root,root,755)
%config /etc/httpd/conf.d/ictfax.conf

# include all ictfax files and folder
%defattr(644,apache,apache,755)
%{ictfax_home}

%post
# alter firewall for sip
%if %{rhel} < 7
# apache web port
/sbin/iptables -I INPUT -p tcp -m state --state NEW -m tcp --dport 80 -j ACCEPT    # tcp
/etc/init.d/iptables save
%else
# apache web port
/bin/firewall-cmd --zone=public --add-port=80/tcp --permanent  # tcp
/bin/firewall-cmd --reload
%endif

%changelog
* Fri Jan 11 2019 Nasir Iqbal <nasir@ictinnovations.com> - 4.0.0
- ICTFax 4.0.0 release
