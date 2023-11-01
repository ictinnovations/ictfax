import { MenuItem } from "./menu-item";

export const MENU_ITEMS: MenuItem[] = [
  {
    title: 'Dashboard',
    link: '/pages/dashboard',
    icon: 'home-outline',
    home: true,
    key: 'dashboard'
  },
  
  // {
  //   title: 'Fax Campaigns',
  //   link: '/pages/campaigns/campaigns',
  //   icon: 'radio-outline',
  //   key : 'campaigns'
  // },

  {
    title: 'Send Fax',
    icon: 'arrow-upward-outline',
    link: '/pages/sendfax/sendfax',
    key : 'send_fax'
  },
  {
    title: 'Receive Fax',
    icon: 'arrow-downward-outline',
    link: '/pages/infax',
    key : 'receive_fax'
  },
  
      {
        title: 'Contacts',
        link: '/pages/contact/contacts',
        icon: 'person-add-outline',
        key : 'contacts'
      },
      
      // {
      //   title: 'Groups',
      //   link: '/pages/contact/group',
      //   icon: 'people-outline',
      //   key : 'group'
      // },
      
      {
        title: 'Contact DNC',
        link: '/pages/contact_dnc/contact_dnc',
        icon :'person-add-outline',
         key:'contact_dnc'
       },
      
   
  {
    title: 'Fax Documents',
    link: '/pages/message/document',
    icon: 'file-text-outline',
    key : 'fax_documents'
  },
  {
    title: 'My DIDs',
    link: '/pages/incoming_number/incoming_number',
    icon: 'arrow-downward-outline',
    key : 'my_dids'
  },
  {
    title: 'Administration',
    icon: 'settings-2-outline',
    key : 'administration',
    children: [
  {
    title: 'DID Numbers',
    link: '/pages/did/did',
    icon: 'smartphone-outline',
    key : 'did_number'
  },
  {
    title: 'Provider / Trunks',
    link: '/pages/provider/provider',
    icon: 'shuffle-2-outline',
    key : 'providers'
  },
  {
    title: 'User Management',
    link: '/pages/user/user',
    icon: 'person-done-outline',
    key : 'user_management'
  },
  {
    title: 'Extensions',
    link: '/pages/extension/extension',
    icon: 'hash-outline',
    key : 'extensions'
  },
 ],
},
];

export const userMenuItems: MenuItem[] = [   {
  title: 'Dashboard',
  link: '/pages/dashboard',
  icon: 'home-outline',
  home: true,
  key: 'dashboard'
},

// {
//   title: 'Fax Campaigns',
//   link: '/pages/campaigns/campaigns',
//   icon: 'radio-outline',
//   key : 'campaigns'
// },

{
  title: 'Send Fax',
  icon: 'arrow-upward-outline',
  link: '/pages/sendfax/sendfax',
  key : 'send_fax'
},
{
  title: 'Receive Fax',
  icon: 'arrow-downward-outline',
  link: '/pages/infax',
  key : 'receive_fax'
},

    {
      title: 'Contacts',
      link: '/pages/contact/contacts',
      icon: 'person-add-outline',
      key : 'contact'
    },
    
    // {
    //   title: 'Groups',
    //   link: '/pages/contact/group',
    //   icon: 'people-outline',
    //   key : 'group'
    // },
    
  
{
  title: 'Fax Documents',
  link: '/pages/message/document',
  icon: 'file-text-outline',
  key : 'fax_document'
},
{
  title: 'My DIDs',
  link: '/pages/incoming_number/incoming_number',
  icon: 'arrow-downward-outline',
  key : 'my_dids'
},
{
  title: 'Administration',
  icon: 'settings-2-outline',
  key : 'administration',
  children: [
{
  title: 'DID Numbers',
  link: '/pages/did/did',
  icon: 'smartphone-outline',
  key : 'did_number'
},
{
  title: 'Provider / Trunks',
  link: '/pages/provider/provider',
  icon: 'shuffle-2-outline',
  key : 'provider'
},
{
  title: 'User Management',
  link: '/pages/user/user',
  icon: 'person-done-outline',
  key : 'user_management'
},
{
  title: 'Extensions',
  link: '/pages/extension/extension',
  icon: 'hash-outline',
  key : 'extensions'
},
],
},
];
