-- # Update from revision 27 to 89

DROP TABLE did;
DROP FUNCTION did_called;
DROP TABLE recording;

CREATE TABLE recording
(
   recording_id             int(11) unsigned       NOT NULL auto_increment,
   name                     varchar(128)           NOT NULL,
   type                     varchar(8)             NOT NULL,
   file_name                varchar(128)           NOT NULL,
   description              varchar(255)           NOT NULL default '',
   length                   int(11)                NOT NULL default 0,
   codec                    varchar(16)            NOT NULL default 'pcm',
   channel                  int(2)                 NOT NULL default 1,
   sample                   int(11)                NOT NULL default 8000,
   bitrate                  int(11)                NOT NULL default 16,
   date_created             int(11)                default NULL,
   created_by               int(11) unsigned       default NULL,
   last_updated             int(11)                default NULL,
   updated_by               int(11) unsigned       default NULL,
   PRIMARY KEY (recording_id)
) ENGINE = InnoDB;
CREATE INDEX recording_created_by ON recording (created_by);

CREATE TABLE transmission_session
(
   transmission_id                int(11) unsigned       default NULL,
   time_start                     int(11)                default 0,
   data                           text,
   PRIMARY KEY (transmission_id)
) ENGINE = InnoDB;

CREATE TABLE ivr
(
   ivr_id               int(11) unsigned       NOT NULL auto_increment,
   name                 varchar(128)           NOT NULL,
   description          varchar(255)           NOT NULL default '',
   data                 text,
   created              int(11) unsigned       default NULL,
   created_by           int(11) unsigned       default NULL,
   PRIMARY KEY (ivr_id)
) ENGINE = InnoDB;

CREATE TABLE program (
   program_id                  int(11) unsigned         NOT NULL auto_increment,
   name                        varchar(64)              NOT NULL default '',
   type                        varchar(64)              NOT NULL default '',
   data                        text,
   parent_id                   int(11) unsigned         default NULL,
   PRIMARY KEY (program_id)
) ENGINE = InnoDB;

CREATE TABLE service_application
(
   service_flag                  int(11) unsigned       default 1,
   source                        varchar(128)           default '*',
   destination                   varchar(128)           default '*',
   context                       varchar(16)            default '*',
   application_id                int(11)                default NULL,
   account_id                    int(11)                default NULL,
   auth_method                   varchar(16)            default 'none',
   PRIMARY KEY  (service_flag, source, destination, context)
) ENGINE = InnoDB;
CREATE INDEX service_application_source ON service_application (source);
CREATE INDEX service_application_destination ON service_application (destination);
CREATE INDEX service_application_context ON service_application (context);

ALTER TABLE config_data CHANGE data data text;

ALTER TABLE transmission CHANGE message_id program_id                  int(11) unsigned         default NULL;
ALTER TABLE transmission CHANGE account_id account_id                  int(11)                  default NULL;
ALTER TABLE transmission CHANGE contact_id contact_id                  int(11)                  default NULL;
ALTER TABLE transmission CHANGE data data text;

ALTER TABLE spool CHANGE account_id account_id                  int(11)                  default NULL;

ALTER TABLE schedule ADD is_recurring                  int(4)                 NOT NULL default 0;
ALTER TABLE schedule ADD account_id                    int(11)                default NULL;

ALTER TABLE application CHANGE data data text;
ALTER TABLE application ADD program_id                  int(11) unsigned         default NULL;
CREATE INDEX application_programe_id ON application (program_id); 

ALTER TABLE action ADD weight                      int(4)                   NOT NULL default 0;

