import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Dashboard',
    link: '/pages/dashboard',
    icon: 'home-outline',
    home: true,
  },
  /*
  {
    title: 'Fax Campaigns',
    link: '/pages/campaigns/campaigns',
    icon: 'radio-outline'
  },
  */
  {
    title: 'Send Fax',
    icon: 'arrow-upward-outline',
    link: '/pages/sendfax/sendfax',
  },
  {
    title: 'Receive Fax',
    icon: 'arrow-downward-outline',
    link: '/pages/infax',
  },
  {
    title: 'Contacts',
    icon: 'person-outline',
    children: [
      {
        title: 'Contacts',
        link: '/pages/contact/contacts',
        icon: 'person-add-outline'
      },
      
      {
        title: 'Groups',
        link: '/pages/contact/group',
        icon: 'people-outline'
      },
      
    ],
  },
  {
    title: 'Fax Documents',
    link: '/pages/message/document',
    icon: 'file-text-outline'
  },
  {
    title: 'My DIDs',
    link: '/pages/incoming_number/incoming_number',
    icon: 'arrow-downward-outline',
  },
  {
    title: 'Administration',
    icon: 'settings-2-outline',
    children: [
  {
    title: 'DID Numbers',
    link: '/pages/did/did',
    icon: 'smartphone-outline',
  },
  {
    title: 'Provider / Trunks',
    link: '/pages/provider/provider',
    icon: 'shuffle-2-outline',
  },
  {
    title: 'User Management',
    link: '/pages/user/user',
    icon: 'person-done-outline'
  },
  {
    title: 'Extensions',
    link: '/pages/extension/extension',
    icon: 'hash-outline'
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
    title: 'Send Fax',
    icon: 'ion-arrow-up-c',
    link: '/pages/sendfax/sendfax',
  },
  {
    title: 'Receive Fax',
    icon: 'ion-arrow-down-c',
    link: '/pages/infax',
  },
  {
    title: 'Contacts',
    icon: 'person-outline',
    children: [
      {
        title: 'Contacts',
        link: '/pages/contact/contacts',
        icon: 'person-add-outline'
      },
      
      {
        title: 'Groups',
        link: '/pages/contact/group',
        icon: 'people-outline'
      },
      
    ],
  },
  {
    title: 'Fax Documents',
    link: '/pages/message/document',
    icon: 'fa fa-file',
  },
  {
    title: 'My DIDs',
    link: '/pages/incoming_number/incoming_number',
    icon: 'arrow-downward-outline',
  },
  {
    title: 'Administration',
    icon: 'ion-person',
    children: [
      {
        title: 'DID Numbers',
        link: '/pages/did/did',
        icon: 'smartphone-outline',
      },
  {
    title: 'Extensions',
    link: '/pages/extension/extension',
    icon: 'hash-outline',
  },
 ],
},
];
