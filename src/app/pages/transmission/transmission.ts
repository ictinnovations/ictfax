export class Transmission {
  program_id: number;
  title: string;
  transmission_id: number;
  service_flag: number;
  account_id: number;
  phone: number;
  email: string;
  contact_id: number;
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
  last_run:any;
  contact: {
    phone:any;
  }
  contact_phone:any;
}

export class SMSProgram {
  program_id: number;
  text_id: number;
  name: string;
}

export class TemplateProgram {
  program_id: number;
  template_id: number;
  name: string;
}

export class DocumentProgram {
  program_id: number;
  document_id: number;
  name: string;
}

export class VoiceCallProgram {
  program_id: number;
  recording_id: number;
  name: string;
}

export class Program {
  program_id: number;
  parent_id: number;
  name: string;
  type: string;
  text_id: number;
  template_id: number;
  document_id: number;
  contact_id: number;
  recording_id: number;
}

export class IVRProgram {
  program_id: number;
  name: string;
}
