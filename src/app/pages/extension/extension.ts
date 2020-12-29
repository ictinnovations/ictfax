export class Extension {
  account_id: number;
  username: string;
  passwd: string;
  passwd_pin: string;
  first_name: string;
  last_name: string;
  phone: number;
  email: string;
  address: string;
  active: number;
  type: any;
  settings : {
    emailtofax_coversheet: any;
  }
}

export class Settings {
  value:any;
}
