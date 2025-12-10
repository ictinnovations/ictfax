FORMAT: 1A
HOST: http://ictcore.example.com/api

# ICTFax REST APIs Guide

## Overview

* __API Endpoint__ : Domain / web url corresponding address for ictcore/wwwroot installation directory.
* __API Access__ : Any valid combination of username and password created in usr table.
* __POST Method__: Any data submitted to POST method based APIs must be encoded as json.
* __DELETE Method__: user can use both DELETE and GET methods for delete APIs.
* __List APIs__: All list APIs support optional search filter, to search user need to use search parameters in url as query string using key value pair.

### HTTP Response Code

* __200__ Function successfully executed.
* __401__ Invalid or missing username or password.
* __403__ Permission denied. User is not permitted to perform requested action.
* __404__ Invalid API location or request to none existing resource. Check the URL and posting method (GET/POST).
* __412__ Data validation failed.
* __417__ Unexpected error.
* __423__ System is not ready to perform requested action.
* __500__ Internal server error. Try again at a later time.
* __501__ Feature not implemented.

# Group Authenticate

## Authentication [/authenticate]

Create and return authentication token / session key.

### Authenticate parameter [POST]

__Note:__ Unlike other APIs this API does not require separate authentication in header

+ Request (application/json)

    + Attributes

        + username: admin (string) - api username for authentication
        + passowrd: mysecret (string) - api password for authentication

+ Response 200 (application/json)
    
    + Attributes 
        
        + token : token (string) 

# Group Program

## General program related function [/programs]

To create program please use respective APIs separately designed for each type of program.

### Get all Programs [GET]

+ Request

    + Headers

            Authentication: Bearer JWT

+ Response 200 (application/json)

    + Attributes (array[Program])


### View a Program Detail [GET]

+ Request

    + Headers

            Authentication: Bearer JWT

+ Response 200 (application/json)

    + Attributes (Program)


### New Transmission [PUT]

+ Request (application/json)

    + Headers

            Authentication: Bearer JWT

    + Attributes (Transmission)

+ Response 200 (application/json)

    + Attributes

        + transmission_id: 1 (number) - transmission id of recently created transmission

### Get Transmission [GET]

+ Request

    + Headers

            Authentication: Bearer JWT

+ Response 200 (application/json)

    + Attributes (Transmission)


# Group Fax to Email program

##  Fax to Email program [/programs/faxtoemail]

### Create New  Fax to Email program [POST]

+ Request (application/json)

    + Headers

            Authentication: Bearer JWT

    + Attributes (ProgramFaxtoemail)

+ Response 200 (application/json)

    + Attributes

        + program_id : 1 (number) - program id  of recently created program

# Group Send FAX program

## Send FAX program [/programs/sendfax]

Prepare given fax document for provided account, and make it ready to be sent

### Create New  Send FAX program [POST]

+ Request (application/json)

    + Headers

            Authentication: Bearer JWT

    + Attributes (ProgramSendfax)

+ Response 200 (application/json)

    + Attributes

        + program_id : 1 (number) - program id  of recently created program


# Group Transmission - the actual call or action

create call request / dial / send message

## Collection of Transmission [/transmissions]

### Create New Transmission [POST]

+ Request (application/json)

    + Headers

            Authentication: Bearer JWT

    + Attributes (Transmission)

+ Response 200 (application/json)

    + Attributes
            
        + text_id: 1 (number) - text id of recently created template

### Get all Transmissions [GET]

+ Request

    + Headers

            Authentication: Bearer JWT

+ Response 200 (application/json)

    + Attributes (Transmission)

## single Transmission  [/transmissions/{transmission_id}]

+ Parameters

    + transmission_id (number) - ID of the transmission in the form of an integer

### Get a Transmission [GET]

+ Request

    + Headers

            Authentication: Bearer JWT

+ Response 200 (application/json)

    + Attributes (Transmission)

### Delete Transmission [DELETE]

+ Request (application/json)

    + Headers

            Authentication: Bearer JWT

+ Response 200

## Transmission Send [/transmissions/{transmission_id}/send]

+ Parameters

    + transmission_id (number) - ID of the transmission in the form of an integer

### Send Transmission [POST]

+ Request (application/json)

    + Headers

            Authentication: Bearer JWT

+ Response 200 (application/json)

    + Attributes
        
        + spool_id: 1 (number) - Spool ID of resulted attempt
            
# Group Contact

## Collection of Contacts [/contacts]

### Create New Contact [POST]

+ Request (application/json)

    + Headers

            Authentication: Bearer JWT

    + Attributes (Contact)

+ Response 200 (application/json)

    + Attributes

        + contact_id : 1 (number) - id of recently created contact
            

### Get All Contacts [GET]

+ Request

    + Headers

            Authentication: Bearer JWT

+ Response 200 (application/json)

  + Attributes (array[Contact])

## Single Contact [/contacts/{contact_id}]

+ Parameters

    + contact_id (number) - ID of the contact in the form of an integer


### View a Contact Detail [GET]

+ Request

    + Headers

            Authentication: Bearer JWT

+ Response 200 (application/json)

    + Attributes (Contact)

### Update Contacts [PUT]

+ Request (application/json)

    + Headers

            Authentication: Bearer JWT

    + Attributes (Contact)

+ Response 200 (application/json)

    + Attributes (Contact)

### Delete Contact [DELETE]

+ Request (application/json)

    + Headers

            Authentication: Bearer JWT

+ Response 200 (application/json)

# Group Message

There are different kinds of messages like fax,voice,sms and email

## Fax Documents [/messages/documents]

### Create New Document [POST]

+ Request (application/json)

    + Headers

            Authentication: Bearer JWT

    + Attributes (DocumentPost)

+ Response 200 (application/json)

    + Attributes

        + document_id: 1 (number) - document id of recently created document record


### Get all Documnets [GET]

+ Request

    + Headers

            Authentication: Bearer JWT

+ Response 200 (application/json)

    + Attributes (array[Document])

## Single Document [/messages/documents/{document_id}]

Note: Media / document can be downloaded separately using GET messages/documents/{document_id}/media

+ Parameters

    + document_id (number) - ID of the document in the form of an integer

### View a Document Detail [GET]

+ Request

    + Headers

            Authentication: Bearer JWT

+ Response 200 (application/json)

    + Attributes (Document)

### Update Document [PUT]

+ Request (application/json)

    + Headers

            Authentication: Bearer JWT

    + Attributes (Document)

+ Response 200 (application/json)

    + Attributes (Document)

### Delete Document [DELETE]

+ Request (application/json)

    + Headers

            Authentication: Bearer JWT

+ Response 200

## Add Document File [/messages/documents/{document_id}/media]

+ Parameters

    + document_id (number) - ID of the document in the form of an integer

### Add / Update Document file [PUT]

Upload media / pdf file for an existing document, this method should be called followed by POST messages/documents

+ Request (application/pdf)

    + Headers

            Authentication: Bearer JWT

    + Body

            "Pdf file contents"

+ Response 200 (application/json)

    + Attributes

        + document_id: 1 (number) - document id of updated record

### Get Document [GET]

Download Document file

+ Request

    + Headers

            Authentication: Bearer JWT

+ Response 200 (application/pdf)

    + Body

            "Pdf file contents"

# Group Reports

## Get Transmission Status Report [/transmissions/{transmission_id}/status]

+ Parameters

    + transmission_id (number) - ID of the transmission in the form of an integer

### Transmission Status [GET]

Get current status of an existing transmission

+ Request

    + Headers

            Authentication: Bearer JWT

+ Response 200 (application/json)

    + Attributes
                
        + Status: status (string) - Will return one of the following status (pending, processing, completed, failed, invalid)


## Get Transmission detail Report [/transmissions/{transmission_id}/detail]

+ Parameters

    + transmission_id (number) - ID of the transmission in the form of an integer

### Transmission Detail [GET]

A list of attempts (spool) with their detail, which system has made to deliver that transmission

+ Request

    + Headers

            Authentication: Bearer JWT

+ Response 200 (application/json)

    + Attributes (array[Spool])

## Get Transmission result Report [/transmissions/{transmission_id}/result]

+ Parameters

    + transmission_id (number) - ID of the transmission in the form of an integer

### Transmission Result [GET]

Complete details of each step along with remote side responses, for requested transmission

+ Request

    + Headers

            Authentication: Bearer JWT

+ Response 200 (application/json)

    + Attributes (array[Result])

# Group User account / Email / DID / Extension

## Users Accounts [/accounts]

### Create Account [POST]

+ Request (application/json)

    + Headers

            Authentication: Bearer JWT

    + Attributes (Account)

+ Response 200 (application/json)

    + Attributes
         
         + account_id: 1 (number) - account id of recently created account record

### Get All Accounts [GET]

+ Request

    + Headers

            Authentication: Bearer JWT

+ Response 200 (application/json)

    + Attributes (array[Account])


## Single Account Detail [/accounts/{account_id}]

+ Parameters

    + account_id (number) - ID of the account in the form of an integer

### View a Account [GET]

Read / view complete account data

+ Request

    + Headers

            Authentication: Bearer JWT

+ Response 200 (application/json)

    + Attributes (Account)

### Update Account [PUT]

Update an existing account

+ Request (application/json)

    + Headers

            Authentication: Bearer JWT

    + Attributes (Account)

+ Response 200 (application/json)

   + Attributes (Account)

### Delete Account [DELETE]

Delete an existing account

+ Request (application/json)

    + Headers

            Authentication: Bearer JWT

+ Response 200

## Subscribe an account to some exiting program [/accounts/{account_id}/programs/{program_id}]

+ Parameters

    + account_id (number) - ID of the account in the form of an integer
    + program_id (number) - ID of the program in the form of an integer

### Subscribe an account to some exiting program [PUT]

+ Request (application/json)

    + Headers

            Authentication: Bearer JWT

+ Response 200 (application/json)

    + Attributes (Account)

### Unsubscribe an account from given program [DELETE]

+ Request (application/json)

    + Headers

            Authentication: Bearer JWT

+ Response 200 (application/json)

    + Attributes (Account)

## Clear an account from all subscribed programs [/accounts/{account_id}/programs]

+ Parameters

    + account_id (number) - ID of the account in the form of an integer

### Clear an account all subscribed program [DELETE]

+ Request (application/json)

    + Headers

            Authentication: Bearer JWT

+ Response 200 (application/json)

    + Attributes (Account)

## Change account ownership [/accounts/{account_id}/users/{user_id}]

+ Parameters

    + account_id (number) - ID of the account in the form of an integer
    + user_id (number) - ID of the user in the form of an integer

###  Change account ownership assign account to some other user [PUT]

+ Request (application/json)

    + Headers

            Authentication: Bearer JWT

+ Response 200 (application/json)

    + Attributes (Account)

## Dissociate a account from any user [/accounts/{account_id}/users]

+ Parameters

    + account_id (number) - ID of the account in the form of an integer

### Dissociate a account from any user, make it free to assign [DELETE]

+ Request (application/json)

    + Headers

            Authentication: Bearer JWT

+ Response 200 (application/json)

    + Attributes (Account)

# Group User Management

## User Collection [/users]

### Create New User [POST]

+ Request (application/json)

    + Headers

            Authentication: Bearer JWT

    + Attributes (User)

+ Response 200 (application/json)

    + Attributes
        
        + user_id: 1 (number) - user id of recently created user record

### Get All Users [GET]

list all exiting users, optionally client can filter users using query string (key value pair) in url, while using any of following fields

+ Request

    + Headers

            Authentication: Bearer JWT

+ Response 200 (application/json)

    + Attributes (array[User])

## Single User Detail [/users/{user_id}]

+ Parameters

    + user_id (number) - ID of the user in the form of an integer

### View a User Detail [GET]

+ Request

    + Headers

            Authentication: Bearer JWT

+ Response 200 (application/json)

    + Attributes (User)

### Update User [PUT]

+ Request (application/json)

    + Headers

            Authentication: Bearer JWT

    + Attributes (User)

+ Response 200 (application/json)

    + Attributes (User)

### Delete User [DELETE]

+ Request (application/json)

    + Headers

            Authentication: Bearer JWT

+ Response 200

# Group Trunk / Termination Providers APIs

## Trunk Termination [/providers]

### Create Provider [POST]

+ Request (application/json)

    + Headers

            Authentication: Bearer JWT

    + Attributes (Provider)

+ Response 200 (application/json)

    + Attributes
         
         + provider_id: 1 (number) -  provider id of recently created provider record


### Get All Providers [GET]

+ Request

    + Headers

            Authentication: Bearer JWT

+ Response 200 (application/json)

    + Attributes (array[Provider])

## Single Provider Action [/providers/{provider_id}]

+ Parameters

    + provider_id (number) - ID of the user in the form of an integer

### Update Provider [PUT]

+ Request (application/json)

    + Headers

            Authentication: Bearer JWT

    + Attributes (Provider)

+ Response 200 (application/json)

     + Attributes (Provider)

### View a Provider Detail [GET]

+ Request

    + Headers

            Authentication: Bearer JWT

+ Response 200 (application/json)

    + Attributes (Provider)

### Delete Providers [DELETE]

+ Request (application/json)

    + Headers

            Authentication: Bearer JWT

+ Response 200


# Data Structures

## Statistics (object)
+ campaign_total: 1 (number) - total number of campaign
+ campaign_active: 0 (number) -total number of active campaign
+ group_total: 12 (number) - number of groups
+ contact_total: 5 (number) - number of contacts
+ transmission_total: 1 (number) - number of transmissions
+ transmission_active: 1 (number) - number of active transmission
+ spool_total: 1 (number) - number of spools
+ spool_success: 1 (number) - number of success spools
+ spool_failed: 1 (number) - number of unsuccessful spools

## Contact (object)
+ first_name: first name (string, required)
+ last_name: last name (string, optional)
+ phone:   03001234567 (number, required)
+ email:  email (string, optional)
+ address: address (string, optional)
+ custom1: custom 1 (string, optional)
+ custom2: custom 2 (string, optional)
+ custom3: custom 3 (string, optional)
+ description: description (string, optional)

## Group (object)
+ id: 1 (number, default) - id is auto increment
+ name: group name (string,required)
+ description: Description (string, optional)

## DocumentPost (object)
+ name: group name (string,required)
+ description: Description (string, optional)

## Document (DocumentPost)
+ type: type (string) - three digit file extension representing file type

## Template (object)
+ name: name (string, required)
+ description: Description (string, optional)
+ subject: Subject (string, required)
+ body:  body (string, required) - HTML Message
+ body_alt: body alt (string, optional) - Plain Message
+ type: upload file (string, optional) - three digit file extension representing file type

## Text (object)
+ name: name (string, required)
+ data: Data (string, required) - Actual message
+ type: type (string, optional) - unicode or plain or binary
+ description: Description (string, optional)

## Program (object)
+ name: name (string, required)
+ type: type (string, optional) - program type
+ parent_id: 1 (number, optional) - program id of parent program

## TransmissionPost (object)
+ title: title (string)
+ origin:  origin (string) -  reference to function / program which is responsible creation of this transmission
+ contact_id:  1 (number, required) - contact id to contact where to transmit message
+ account_id:  1 (number) -  account id of associated account
+ service_flag:  1 (number) - Type of transmission service i.e Email::SERVICE_FLAG or Voice::SERVICE_FLAG
+ program_id:  1 (number, required) - program id of program which will be used with this transmission
+ direction:  direction (string) - either can be outbound or inbound

## Transmission (TransmissionPost)
+ status:  status (string) - if complete or failed
+ response: response (string) - the cause of error, transmission failure

## ProgramEmailtofax (Program)
+ account_id: 1 (number) - account id of account for which this program is being created

## ProgramFaxtoemail (Program)
+ account_id: 1 (number) - account id of account for which this program is being created

## ProgramReceivefax (Program)
+ account_id: 1 (number) - account id of account for which this program is being created

## ProgramSendfax (Program)
+ document_id: 1 (number) - document id of fax document for which this program is being created

## ProgramReceiveemail (Program)
+ account_id: 1 (number) - account id of account for which this program is being created

## ProgramSendemail (Program)
+ template_id: 1 (number) - template id of email template for which this program is being created

## ProgramReceivesms (Program)
+ account_id: 1 (number) - account id of account for which this program is being created

## ProgramSendsms (Program)
+ text_id: 1 (number) - text id of SMS text for which this program is being created

## ProgramVoicemessage (Program)
+ recording_id: 1 (number) - recording id of voice recording for which this program is being created

## Account (object)
+ username: username (string)
+ passwd: password (string)
+ passwd_pin: password pin (string)
+ first_name: first name (string)
+ last_name: last name (string)
+ phone: 03001234567 (number)
+ email: email (string)
+ address: address (string)
+ active: 1 (number) - 1 for active, 0 for disabled

## User (object)
+ username: username (string)
+ passwd: password (string)
+ first_name: first name (string)
+ last_name: last name (string)
+ phone: 03001234567 (number)
+ email: email (string)
+ address: address (string)
+ company: company name (string)
+ country_id: 1 (number) - see country table
+ timezone_id: 1 (number) - see timezone table
+ active: 1 (number) - 1 for active, 0 for disabled

## Provider (object)
+ name: name (string)
+ gateway_flag: 1 (number) - Type of gateway i.e Freeswitch::GATEWAY_FLAG or Kannel::GATEWAY_FLAG
+ service_flag: 1 (number) - Type of transmission service i.e Email::SERVICE_FLAG or Voice::SERVICE_FLAG
+ node_id: 1 (number, optional) - see node table
+ host: ip-address (string) - ip address to termination server
+ port: 8080 (number, optional)
+ username: username (string,required)
+ password: password (string, optional)
+ dialstring: dail-string (string, optional)
+ prefix: 12 (number, optional) -number which is required to be dialed before actual phone number
+ settings: settings (string, optional) - any additional configuration required by this provider
+ register: 1 (number, optional) 1 for yes, 0 for no
+ weight: 10 (number) provider having lighter weight will be used more frequently
+ type: type (string)
+ active: 1 (number) 1 for active, 0 for disabled

## Campaign (object)
+ program_id: 1 (number)
+ group_id: 2 (number)
+ cpm: 2 (number) - transmissions / cycles per second
+ try_allowed: 2 (number)
+ account_id: 1 (number) - account_id of associated account
+ status: active (string) - current status of campaign

## Spool (object)
+ spool_id: 1 (number)
+ time_spool: 1518705479 (number)
+ time_start: 1518705479 (number)
+ time_connect: 1518705479 (number)
+ time_end: 1518705479 (number)
+ status: completed (string)
+ response: busy (string)
+ transmission_id: 1 (number)

## Result (object)
+ spool_result_id: 1 (number)
+ spool_id: 1 (number)
+ type: dtmf (string) - type of result
+ name: age (string) - result id / name
+ data: 22 (string) - actual result

