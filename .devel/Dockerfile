FROM ictinnovations/ictcore:latest
MAINTAINER "Nasir Iqbal" <nasir@ictinnovations.com>
ENV container docker
RUN yum -y install ictfax drupal7-ctools; yum clean all; 
RUN (cd /lib/systemd/system/sysinit.target.wants/; for i in *; do [ $i == \
systemd-tmpfiles-setup.service ] || rm -f $i; done); \
rm -f /lib/systemd/system/multi-user.target.wants/*;\
rm -f /etc/systemd/system/*.wants/*;\
rm -f /lib/systemd/system/local-fs.target.wants/*; \
rm -f /lib/systemd/system/sockets.target.wants/*udev*; \
rm -f /lib/systemd/system/sockets.target.wants/*initctl*; \
rm -f /lib/systemd/system/basic.target.wants/*;\
rm -f /lib/systemd/system/anaconda.target.wants/*;
VOLUME [ "/sys/fs/cgroup" ]
CMD ["/usr/sbin/init"]


#  config: /usr/local/freeswitch/conf/freeswitch.conf
#  pidfile: /usr/local/freeswitch/run/freeswitch.pid

sed -i 's/#  pidfile: \/usr\/local\/freeswitch\/run\/freeswitch.pid/#  pidfile: \/run\/freeswitch\/freeswitch.pid/g' /etc/rc.d/init.d/freeswitch
