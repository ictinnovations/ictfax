export class SendFax {
  program_id: number;
  title: string;
  transmission_id: number;
  service_flag: number;
  account_id: number;
  phone: any;
  email: string;
  contact_id: any;
  origin: string;
  direction: string;
  status: string;
  response: string;
  program_type: string;
  try_allowed: any;
  fax_from: any;
  fax_to: any;
  job_id: any;
  result: any;
  last_run: any;
  contact: {
    phone:any;
  }
  contact_phone:any;
}

export class DocumentProgram {
  program_id: number;
  document_id: number;
  name: string;
}

