export class Campaign {
  campaign_id: number;
  program_id: number;
  program_type: string;
  group_id: number;
  cpm: number;
  try_allowed: number;
  account_id: number;
  status: string;
  contact_total: any;
  contact_done: any;
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

export class IVRProgram {
  program_id: number;
  ivr_id: number;
  name: string;
}