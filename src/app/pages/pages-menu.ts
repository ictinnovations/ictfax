import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Dashboard',
    icon: 'nb-home',
    link: '/pages/dashboard',
    home: true,
  },
  {
    title: 'Outbound Fax',
    icon: 'ion-arrow-up-c',
    link: '/pages/transmission/transmissions',
  },
  {
    title: 'Inbound Fax',
    icon: 'ion-arrow-down-c',
    link: '/pages/infax',
  },
  {
    title: 'Contacts',
    icon: 'nb-phone',
    children: [
      {
        title: 'Contacts',
        link: '/pages/contact/contacts',
        icon: 'nb-person',
      },
    ],
  },
  {
    title: 'Resources',
    icon: 'ion-android-apps',
    children: [
  {
    title: 'Fax Documents',
    link: '/pages/message/document',
    icon: 'fa fa-file',
  },
],
  },
  {
    title: 'DID Numbers',
    link: '/pages/did/did',
    icon: 'fa fa-phone-square',
  },
  {
    title: 'Incoming numbers',
    link: '/pages/incoming_number/incoming_number',
    icon: 'ion-arrow-down-c',
  },
  {
    title: 'Administartion',
    icon: 'ion-person',
    children: [
  {
    title: 'Provider / Trunks',
    link: '/pages/provider/provider',
    icon: 'fa fa-user-circle-o',
  },
  {
    title: 'User Management',
    link: '/pages/user/user',
    icon: 'ion-person',
  },
  {
    title: 'Extensions',
    link: '/pages/extension/extension',
    icon: 'fa fa-phone-square',
  },
 ],
},
];

export const userMenuItems: NbMenuItem[] = [
  {
    title: 'Dashboard',
    icon: 'nb-home',
    link: '/pages/dashboard',
    home: true,
  },
  {
    title: 'Outbound Fax',
    icon: 'ion-arrow-up-c',
    link: '/pages/transmission/transmissions',
  },
  {
    title: 'Inbound Fax',
    icon: 'ion-arrow-down-c',
    link: '/pages/infax',
  },
  {
    title: 'Contacts',
    icon: 'nb-phone',
    children: [
      {
        title: 'Contacts',
        link: '/pages/contact/contacts',
        icon: 'nb-person',
      },
    ],
  },
  {
    title: 'Resources',
    icon: 'ion-android-apps',
    children: [
  {
    title: 'Fax Documents',
    link: '/pages/message/document',
    icon: 'fa fa-file',
  },
],
  },
  {
    title: 'DID Numbers',
    link: '/pages/did/did',
    icon: 'fa fa-phone-square',
  },
  {
    title: 'My Incoming numbers',
    link: '/pages/incoming_number/incoming_number',
    icon: 'ion-arrow-down-c',
  },
  {
    title: 'Administartion',
    icon: 'ion-person',
    children: [
  {
    title: 'Extensions',
    link: '/pages/extension/extension',
    icon: 'fa fa-phone-square',
  },
 ],
},
];
